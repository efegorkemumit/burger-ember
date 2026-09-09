# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), deployed on Vercel. Delegated: the user asked for a stack recommendation; Next.js on Vercel was proposed as a modern, well-supported default for a marketing site and accepted. Build path: comp-first (an image comp sets the visual bar before code, confirmed by the user).

## Users

Primary user is a first-time researcher: someone who has not eaten at Burger Ember before and is deciding whether to try it. They arrive comparing photos, menu, price point, and overall vibe against other options nearby, typically on a phone, before committing to a visit. The site's job is to make that decision easy and to convert interest into a visit (walking in, calling, or getting directions) — this is a marketing site, not a transactional ordering flow.

## Product Purpose

Burger Ember is a physical burger restaurant. The site exists to represent the restaurant online: showcase the menu, communicate the fire/ember cooking method that sets it apart, and give a first-time visitor enough confidence (photos, location, hours, story) to decide to go. Success is a visitor leaving with a clear read on what the place is and how to get there — not an online purchase.

## Positioning

The restaurant's core differentiator is its cooking method: burgers cooked over live fire / wood embers, not a standard flat-top or generic grill. This is the mechanism a generic burger competitor could not truthfully claim, and it is the central story the site should carry (open-flame/ember cooking, not merely "quality ingredients" in the abstract).

## Operating Context

Visitors evaluate the restaurant primarily on mobile, in the moment of deciding where to eat, often while browsing multiple options. There is no online ordering or reservation flow in scope — the desired actions are viewing the menu, seeing photos, finding the location/hours, and contacting or getting directions to the restaurant.

## Capabilities and Constraints

- No online ordering, delivery, or reservation system is in scope for this build.
- No existing brand assets, logo, photography, menu copy, pricing, location, or hours have been provided yet — these are undecided facts, not to be invented. Real menu items, prices, address, hours, and photography must come from the user before the site presents them as fact; placeholder content used in the meantime must be clearly not passed off as real.
- No CMS or backend has been decided; treat content as static/hardcoded unless the user specifies otherwise.

## Evidence on Hand

None yet. No real menu, pricing, location, hours, photography, testimonials, or press have been supplied. Future work must not fabricate these as if real — use clearly placeholder content until the user provides actual assets and facts.

## Product Principles

1. Lead with the fire/ember cooking method as the restaurant's defining, differentiated craft — it is the one claim a generic competitor can't copy.
2. Optimize for the first-time, on-the-fence researcher deciding whether to visit, not a returning customer or an online orderer.
3. Every path on the site should shorten the distance to an in-person visit: menu, photos, location, hours, and contact must be fast to find, especially on mobile.
4. Never present invented menu items, prices, hours, or photography as real; keep placeholders honestly placeholder until real content lands.
