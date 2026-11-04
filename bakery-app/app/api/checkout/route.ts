import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/components/supabase/admin";

import type { DessertProduct } from "@/components/Bakery/catalogTypes";

import { strawberryProducts } from "@/components/ChocolateCoveredStrawberries/data/strawberries";
import cookieProduct from "@/components/Cookies/data/cookies";
import { cupcakeProducts } from "@/components/Cupcakes/data/cupcakes";
import macaronProduct from "@/components/Macarons/data/macarons";
import { cakeProducts } from "@/components/SouthernDesserts/data/cakes";
import { dessertProducts } from "@/components/SouthernDesserts/data/desserts";
import { pieProducts } from "@/components/SouthernDesserts/data/pies";
import { specialtyProducts } from "@/components/SouthernDesserts/data/specialty";
import { loveMeTeaProduct } from "@/components/LoveMeTeaData";

export const runtime = "nodejs";

const FOOD_TAX_CODE =
  "txcd_40040000";

const SHIPPING_TAX_CODE =
  "txcd_92010001";

const GRATUITY_TAX_CODE =
  "txcd_90020001";

const DELIVERY_FEE_CENTS =
  1000;

const TEA_SHIPPING_FEE_CENTS =
  800;

const TEA_PRODUCT_ID =
  "love-me-loose-leaf-tea";

const MARIN_COUNTY_ZIP_CODES =
  new Set([
    "94901",
    "94903",
    "94904",
    "94920",
    "94924",
    "94925",
    "94929",
    "94930",
    "94933",
    "94937",
    "94938",
    "94939",
    "94940",
    "94941",
    "94942",
    "94945",
    "94946",
    "94947",
    "94948",
    "94949",
    "94950",
    "94956",
    "94957",
    "94960",
    "94963",
    "94964",
    "94965",
    "94966",
    "94970",
    "94971",
    "94973",
    "94998",
  ]);

type CheckoutItem = {
  productId?: unknown;
  flavorId?: unknown;
  sizeId?: unknown;
  addonIds?: unknown;
  quantity?: unknown;
};

type CheckoutDetailsRequest = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  birthday?: unknown;
  orderType?: unknown;
  streetAddress?: unknown;
  city?: unknown;
  postalCode?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  specialInstructions?: unknown;
  occasion?: unknown;
  giftMessage?: unknown;
  tipPercent?: unknown;
  customTipAmount?: unknown;
  joinRewards?: unknown;
  emailUpdates?: unknown;
  textUpdates?: unknown;
};

type CheckoutRequest = {
  items?: unknown;
  customerEmail?: unknown;
  checkoutDetails?: unknown;
};

type OrderType =
  | "pickup"
  | "delivery"
  | "shipping";

const checkoutCatalog:
  DessertProduct[] = [
    ...strawberryProducts,
    cookieProduct,
    ...cupcakeProducts,
    macaronProduct,
    ...cakeProducts,
    ...dessertProducts,
    ...pieProducts,
    ...specialtyProducts,
    loveMeTeaProduct,
  ];

function optionalId(
  value: unknown
) {
  return typeof value ===
    "string" &&
    value.trim()
    ? value.trim()
    : undefined;
}

function requiredText(
  value: unknown,
  fieldName: string
) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} is required.`
    );
  }

  return value.trim();
}

function optionalText(
  value: unknown
) {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

function slugify(
  value: string
) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

function normalizeZipCode(
  value: string
) {
  const match =
    value.match(/\d{5}/);

  return match
    ? match[0]
    : "";
}

function getCheckoutOrigin(
  request: Request
) {
  const forwardedHost =
    request.headers.get(
      "x-forwarded-host"
    );

  const host =
    forwardedHost ??
    request.headers.get(
      "host"
    );

  const forwardedProtocol =
    request.headers.get(
      "x-forwarded-proto"
    );

  if (host) {
    const protocol =
      forwardedProtocol ??
      (
        host.includes(
          "localhost"
        ) ||
        host.startsWith(
          "127.0.0.1"
        )
          ? "http"
          : "https"
      );

    return `${protocol}://${host}`;
  }

  return new URL(
    request.url
  ).origin;
}

function parseCustomTip(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const amount =
    typeof value === "number"
      ? value
      : Number(
          String(
            value
          ).trim()
        );

  if (
    !Number.isFinite(
      amount
    ) ||
    amount < 0
  ) {
    throw new Error(
      "Enter a valid custom tip amount."
    );
  }

  if (amount > 10000) {
    throw new Error(
      "The custom tip amount is too large."
    );
  }

  return Math.round(
    amount * 100
  );
}

export async function POST(
  request: Request
) {
  let savedCheckoutDetailsId:
    | string
    | null = null;

  try {
    const stripeSecretKey =
      process.env
        .STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body =
      (await request.json()) as CheckoutRequest;

    if (
      typeof body.customerEmail !==
        "string" ||
      !body.customerEmail.trim() ||
      !body.customerEmail.includes(
        "@"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const customerEmail =
      body.customerEmail
        .trim()
        .toLowerCase();

    if (
      !Array.isArray(
        body.items
      ) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Your cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.checkoutDetails ||
      typeof body.checkoutDetails !==
        "object" ||
      Array.isArray(
        body.checkoutDetails
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Checkout information is missing.",
        },
        {
          status: 400,
        }
      );
    }

    const details =
      body.checkoutDetails as CheckoutDetailsRequest;

    const firstName =
      requiredText(
        details.firstName,
        "First name"
      );

    const lastName =
      requiredText(
        details.lastName,
        "Last name"
      );

    const phone =
      requiredText(
        details.phone,
        "Phone number"
      );

    const rawOrderType =
      requiredText(
        details.orderType,
        "Order type"
      );

    if (
      rawOrderType !==
        "pickup" &&
      rawOrderType !==
        "delivery" &&
      rawOrderType !==
        "shipping"
    ) {
      throw new Error(
        "Choose a valid fulfillment option."
      );
    }

    const orderType =
      rawOrderType as OrderType;

    const birthday =
      optionalText(
        details.birthday
      );

    const streetAddress =
      optionalText(
        details.streetAddress
      );

    const city =
      optionalText(
        details.city
      );

    const postalCode =
      optionalText(
        details.postalCode
      );

    const preferredDate =
      optionalText(
        details.preferredDate
      );

    const preferredTime =
      optionalText(
        details.preferredTime
      );

    const specialInstructions =
      optionalText(
        details.specialInstructions
      );

    const occasion =
      optionalText(
        details.occasion
      );

    const giftMessage =
      optionalText(
        details.giftMessage
      );

    if (
      orderType !==
        "pickup" &&
      (
        !streetAddress ||
        !city ||
        !postalCode
      )
    ) {
      throw new Error(
        orderType ===
          "shipping"
          ? "Enter your complete tea shipping address."
          : "Enter your complete Marin County delivery address."
      );
    }

    if (
      orderType ===
      "delivery"
    ) {
      const normalizedZip =
        normalizeZipCode(
          postalCode ?? ""
        );

      if (
        !normalizedZip ||
        !MARIN_COUNTY_ZIP_CODES.has(
          normalizedZip
        )
      ) {
        throw new Error(
          "Local delivery is available only within Marin County."
        );
      }
    }

    if (
      orderType !==
        "shipping" &&
      (
        !preferredDate ||
        !preferredTime
      )
    ) {
      throw new Error(
        "Choose your preferred date and time."
      );
    }

    const customTipCents =
      parseCustomTip(
        details.customTipAmount
      );

    let requestedTipPercent =
      Number(
        details.tipPercent ?? 0
      );

    if (
      customTipCents === null
    ) {
      if (
        ![
          0,
          10,
          15,
          20,
        ].includes(
          requestedTipPercent
        )
      ) {
        throw new Error(
          "Choose a valid tip."
        );
      }
    } else {
      requestedTipPercent =
        0;
    }

    const catalogById =
      new Map(
        checkoutCatalog.map(
          (product) => [
            product.id,
            product,
          ]
        )
      );

    const preparedItems =
      (
        body.items as CheckoutItem[]
      ).map(
        (item) => {
          const productId =
            optionalId(
              item.productId
            );

          const flavorId =
            optionalId(
              item.flavorId
            );

          const sizeId =
            optionalId(
              item.sizeId
            );

          if (!productId) {
            throw new Error(
              "A cart item is missing its product ID."
            );
          }

          const quantity =
            Number(
              item.quantity
            );

          if (
            !Number.isInteger(
              quantity
            ) ||
            quantity < 1 ||
            quantity > 20
          ) {
            throw new Error(
              "Each product quantity must be between 1 and 20."
            );
          }

          const product =
            catalogById.get(
              productId
            );

          if (!product) {
            throw new Error(
              "One of the products in your cart no longer exists."
            );
          }

          let selectedSize:
            | NonNullable<
                DessertProduct["sizes"]
              >[number]
            | undefined;

          if (
            product.sizes?.length
          ) {
            if (!sizeId) {
              throw new Error(
                `Choose a size for ${product.name}.`
              );
            }

            selectedSize =
              product.sizes.find(
                (size) =>
                  size.id ===
                  sizeId
              );

            if (!selectedSize) {
              throw new Error(
                `The selected size for ${product.name} is invalid.`
              );
            }
          }

          const flavorSelectionDisabled =
            selectedSize
              ?.disablesFlavorSelection ??
            false;

          let selectedFlavor:
            | DessertProduct["flavors"][number]
            | undefined;

          if (
            !flavorSelectionDisabled &&
            product.flavors.length >
              0
          ) {
            if (!flavorId) {
              throw new Error(
                `Choose a flavor for ${product.name}.`
              );
            }

            selectedFlavor =
              product.flavors.find(
                (flavor) =>
                  flavor.id ===
                  flavorId
              );

            if (!selectedFlavor) {
              throw new Error(
                `The selected flavor for ${product.name} is invalid.`
              );
            }
          }

          const rawAddonIds =
            Array.isArray(
              item.addonIds
            )
              ? item.addonIds
              : [];

          const addonIds =
            rawAddonIds.map(
              (value) => {
                if (
                  typeof value !==
                    "string" ||
                  !value.trim()
                ) {
                  throw new Error(
                    "A cart item contains an invalid add-on."
                  );
                }

                return value.trim();
              }
            );

          const uniqueAddonIds =
            [
              ...new Set(
                addonIds
              ),
            ];

          if (
            uniqueAddonIds.length !==
            addonIds.length
          ) {
            throw new Error(
              "A cart item contains duplicate add-ons."
            );
          }

          const availableAddons =
            new Map(
              (
                product.addons ??
                []
              ).map(
                (addon) => [
                  addon.id,
                  addon,
                ]
              )
            );

          const selectedAddons =
            uniqueAddonIds.map(
              (addonId) => {
                const addon =
                  availableAddons.get(
                    addonId
                  );

                if (!addon) {
                  throw new Error(
                    `An add-on selected for ${product.name} is invalid.`
                  );
                }

                return addon;
              }
            );

          return {
            product,
            selectedFlavor,
            selectedSize,
            selectedAddons,
            quantity,
          };
        }
      );

    const teaOnlyOrder =
      preparedItems.every(
        (item) =>
          item.product.id ===
          TEA_PRODUCT_ID
      );

    if (
      orderType ===
        "shipping" &&
      !teaOnlyOrder
    ) {
      throw new Error(
        "Shipping is available only for Love Me Tea orders."
      );
    }

    const supabase =
      createAdminClient();

    const {
      data: databaseProducts,
      error:
        productsError,
    } =
      await supabase
        .from("products")
        .select(
          "slug, name, base_price, is_available"
        );

    if (productsError) {
      console.error(
        "Unable to load product records:",
        productsError
      );

      throw new Error(
        "We could not verify your cart."
      );
    }

    const productsBySlug =
      new Map(
        (
          databaseProducts ??
          []
        ).map(
          (product) => [
            String(
              product.slug
            ),
            product,
          ]
        )
      );

    const securedItems =
      preparedItems.map(
        (item) => {
          const candidateSlugs =
            [
              item.product.id,

              slugify(
                item.product.name
              ),

              item.selectedFlavor
                ? slugify(
                    item
                      .selectedFlavor
                      .name
                  )
                : null,
            ].filter(
              (
                value
              ): value is string =>
                Boolean(value)
            );

          const databaseProduct =
            candidateSlugs
              .map(
                (slug) =>
                  productsBySlug.get(
                    slug
                  )
              )
              .find(Boolean);

          if (
            !databaseProduct
          ) {
            throw new Error(
              `${item.product.name} is not available for secure checkout yet.`
            );
          }

          if (
            databaseProduct
              .is_available !==
            true
          ) {
            throw new Error(
              `${databaseProduct.name} is currently unavailable.`
            );
          }

          const databasePrice =
            Number(
              databaseProduct
                .base_price
            );

          const basePrice =
            item.selectedSize
              ?.price ??
            item.selectedFlavor
              ?.price ??
            databasePrice;

          if (
            !Number.isFinite(
              basePrice
            ) ||
            basePrice < 0
          ) {
            throw new Error(
              `The price for ${item.product.name} is invalid.`
            );
          }

          const addonTotal =
            item.selectedAddons.reduce(
              (
                total,
                addon
              ) =>
                total +
                addon.price,
              0
            );

          const unitAmount =
            Math.round(
              (
                basePrice +
                addonTotal
              ) *
                100
            );

          if (
            unitAmount < 1
          ) {
            throw new Error(
              `The price for ${item.product.name} is invalid.`
            );
          }

          const optionParts:
            string[] = [];

          if (
            item.selectedFlavor
          ) {
            optionParts.push(
              item
                .selectedFlavor
                .name
            );
          }

          if (
            item.selectedSize
          ) {
            optionParts.push(
              item
                .selectedSize
                .name
            );
          }

          if (
            item.selectedAddons
              .length > 0
          ) {
            optionParts.push(
              item.selectedAddons
                .map(
                  (addon) =>
                    addon.name
                )
                .join(", ")
            );
          }

          const name =
            optionParts.length
              ? `${item.product.name} — ${optionParts.join(
                  " — "
                )}`
              : item.product.name;

          const lineItem:
            Stripe.Checkout.SessionCreateParams.LineItem =
            {
              quantity:
                item.quantity,

              price_data: {
                currency:
                  "usd",

                unit_amount:
                  unitAmount,

                tax_behavior:
                  "exclusive",

                product_data: {
                  name,

                  tax_code:
                    FOOD_TAX_CODE,
                },
              },
            };

          return {
            lineItem,

            lineTotal:
              unitAmount *
              item.quantity,
          };
        }
      );

    const merchandiseSubtotalCents =
      securedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.lineTotal,
        0
      );

    const californiaDateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const datePart = (type: string) =>
      californiaDateParts.find((part) => part.type === type)?.value ?? "";

    const californiaToday =
      `${datePart("year")}-${datePart("month")}-${datePart("day")}`;

    const thanksgivingFreeDelivery =
      orderType === "delivery" &&
      MARIN_COUNTY_ZIP_CODES.has(normalizeZipCode(postalCode ?? "")) &&
      (preferredDate ?? "") >= "2026-11-23" &&
      (preferredDate ?? "") < "2026-11-30";

    const deliveryFeeAmount =
      orderType === "delivery" && !thanksgivingFreeDelivery
        ? DELIVERY_FEE_CENTS
        : 0;

    const shippingFeeAmount =
      orderType ===
      "shipping"
        ? TEA_SHIPPING_FEE_CENTS
        : 0;

    const tipAmount =
      customTipCents !==
      null
        ? customTipCents
        : Math.round(
            merchandiseSubtotalCents *
              (
                requestedTipPercent /
                100
              )
          );

    const stripeLineItems:
      Stripe.Checkout.SessionCreateParams.LineItem[] =
      securedItems.map(
        (item) =>
          item.lineItem
      );

    if (
      deliveryFeeAmount >
      0
    ) {
      stripeLineItems.push(
        {
          quantity: 1,

          price_data: {
            currency:
              "usd",

            unit_amount:
              deliveryFeeAmount,

            tax_behavior:
              "exclusive",

            product_data: {
              name:
                "Local Delivery — Marin County",

              tax_code:
                SHIPPING_TAX_CODE,
            },
          },
        }
      );
    }

    if (
      shippingFeeAmount >
      0
    ) {
      stripeLineItems.push(
        {
          quantity: 1,

          price_data: {
            currency:
              "usd",

            unit_amount:
              shippingFeeAmount,

            tax_behavior:
              "exclusive",

            product_data: {
              name:
                "Love Me Tea Shipping",

              tax_code:
                SHIPPING_TAX_CODE,
            },
          },
        }
      );
    }

    if (
      tipAmount > 0
    ) {
      stripeLineItems.push(
        {
          quantity: 1,

          price_data: {
            currency:
              "usd",

            unit_amount:
              tipAmount,

            tax_behavior:
              "exclusive",

            product_data: {
              name:
                customTipCents !==
                null
                  ? "Optional Tip — Custom"
                  : `Optional Tip (${requestedTipPercent}%)`,

              tax_code:
                GRATUITY_TAX_CODE,
            },
          },
        }
      );
    }

    const {
      data:
        savedDetails,
      error:
        checkoutDetailsError,
    } =
      await supabase
        .from(
          "checkout_details"
        )
        .insert({
          customer_email:
            customerEmail,

          first_name:
            firstName,

          last_name:
            lastName,

          phone,

          birthday,

          order_type:
            orderType,

          street_address:
            orderType ===
            "pickup"
              ? null
              : streetAddress,

          city:
            orderType ===
            "pickup"
              ? null
              : city,

          postal_code:
            orderType ===
            "pickup"
              ? null
              : postalCode,

          preferred_date:
            orderType ===
            "shipping"
              ? null
              : preferredDate,

          preferred_time:
            orderType ===
            "shipping"
              ? null
              : preferredTime,

          special_instructions:
            specialInstructions,

          occasion,

          gift_message:
            giftMessage,

          delivery_fee_amount:
            deliveryFeeAmount,

          shipping_fee_amount:
            shippingFeeAmount,

          tip_amount:
            tipAmount,

          tip_percent:
            customTipCents !==
            null
              ? 0
              : requestedTipPercent,

          join_rewards:
            details.joinRewards ===
            true,

          email_updates:
            details.emailUpdates ===
            true,

          text_updates:
            details.textUpdates ===
            true,

          updated_at:
            new Date().toISOString(),
        })
        .select("id")
        .single();

    if (
      checkoutDetailsError ||
      !savedDetails
    ) {
      console.error(
        "Unable to save checkout details:",
        checkoutDetailsError
      );

      throw new Error(
        "We could not save your checkout information."
      );
    }

    savedCheckoutDetailsId =
      String(
        savedDetails.id
      );

    const stripe =
      new Stripe(
        stripeSecretKey
      );

    const origin =
      getCheckoutOrigin(
        request
      );

    const sessionParams:
      Stripe.Checkout.SessionCreateParams =
      {
        mode:
          "payment",

        customer_email:
          customerEmail,

        line_items:
          stripeLineItems,

        automatic_tax: {
          enabled: true,
        },

        billing_address_collection:
          "required",

        metadata: {
          source:
            "sweet-tey-pastries",

          checkout_details_id:
            savedCheckoutDetailsId,

          order_type:
            orderType,

          tip_type:
            customTipCents !==
            null
              ? "custom"
              : "percentage",
        },

        success_url:
          `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/checkout`,
      };

    if (
      orderType ===
      "shipping"
    ) {
      sessionParams.shipping_address_collection =
        {
          allowed_countries: [
            "US",
          ],
        };
    }

    let session:
      Stripe.Checkout.Session;

    try {
      session =
        await stripe.checkout.sessions.create(
          sessionParams
        );
    } catch (error) {
      await supabase
        .from(
          "checkout_details"
        )
        .delete()
        .eq(
          "id",
          savedCheckoutDetailsId
        );

      throw error;
    }

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "checkout_details"
        )
        .update({
          stripe_session_id:
            session.id,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          savedDetails.id
        );

    if (updateError) {
      console.error(
        "Could not attach Stripe session ID:",
        updateError
      );
    }

    if (!session.url) {
      throw new Error(
        "Stripe did not return a checkout URL."
      );
    }

    return NextResponse.json(
      {
        url:
          session.url,
      }
    );
  } catch (error) {
    console.error(
      "Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "We could not start checkout.",
      },
      {
        status: 400,
      }
    );
  }
}
