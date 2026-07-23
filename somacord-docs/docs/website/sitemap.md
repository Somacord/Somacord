# Somacord Website Sitemap

## Public Pages
- / (Homepage)
- /cities/[city] (City page, e.g. /cities/salt-lake-city)
- /gatherings (Gatherings discovery)
- /gatherings/[id] (Gathering detail)
- /speed-connect (Speed Connect)
- /membership (Membership)
- /partners (Community Partners)
- /about (About)

## Account Pages (Member Experience)
- /signup
- /onboarding/profile (Profile setup: name, city, interests, activities)
- /home (Member home: this week, Speed Connect booking)
- /calendar (Gathering calendar)
- /messages
- /gatherings/create (Create gathering)
- /gatherings/manage (Manage gatherings, for members and Community Partners)
- /profile (Member profile)

## Notes
- Today, `/gatherings/manage` and `/gatherings/create` are shared, per-user pages used by members and Community Partners alike. Under [/docs/business/business-model.md](../business/business-model.md), Community Partners are organizations that should eventually manage Partner Events through an organization-scoped surface, not a personal member page — this site structure hasn't caught up yet. See [/docs/engineering/database-schema.md](../engineering/database-schema.md#known-gaps-vs-business-model-v2).
- City pages start with Salt Lake City; sitemap pattern supports future cities without code changes.

See [page-requirements.md](page-requirements.md) for page-level content requirements (pending) and [seo-strategy.md](seo-strategy.md) for how city pages are optimized.
