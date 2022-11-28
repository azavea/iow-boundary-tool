# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security

## [0.9.1] - 2022-11-28

### Added

- Populate National Utilities [#215](https://github.com/azavea/iow-boundary-tool/pull/215)

## [0.9.0] - 2022-11-28

### Added

- Add Prototype Skeleton [#21](https://github.com/azavea/iow-boundary-tool/pull/21)
- Add Welcome page [#25](https://github.com/azavea/iow-boundary-tool/pull/25)
- Add Sidebar UI [#26](https://github.com/azavea/iow-boundary-tool/pull/26)
- Add Draw Map UI and base polygon functionality [#30](https://github.com/azavea/iow-boundary-tool/pull/30)
- Add Redux state [#37](https://github.com/azavea/iow-boundary-tool/pull/37)
- Add transition to draw page [#43](https://github.com/azavea/iow-boundary-tool/pull/43)
- Add user polygon start location feature [#38](https://github.com/azavea/iow-boundary-tool/pull/38)
- Add satellite basemap [#39](https://github.com/azavea/iow-boundary-tool/pull/39)
- Add municipal boundaries data layer [#40](https://github.com/azavea/iow-boundary-tool/pull/40)
- Add geocoder [#44](https://github.com/azavea/iow-boundary-tool/pull/44)
- Add Parcel Layer [#50](https://github.com/azavea/iow-boundary-tool/pull/50)
- Add distorable reference image layer [#46](https://github.com/azavea/iow-boundary-tool/pull/46)
- Add Land & water basemap [#48](https://github.com/azavea/iow-boundary-tool/pull/48)
- Add user reference image upload [#60](https://github.com/azavea/iow-boundary-tool/pull/60)
- Add labels to municipal boundary layer [#61](https://github.com/azavea/iow-boundary-tool/pull/61)
- Add panes for layer [#57](https://github.com/azavea/iow-boundary-tool/pull/57)
- Add custom user model and define roles [#72](https://github.com/azavea/iow-boundary-tool/pull/72)
- Add utility model and test development users [#73](https://github.com/azavea/iow-boundary-tool/pull/73)
- Add login interface [#77](https://github.com/azavea/iow-boundary-tool/pull/77)
- Add reset password functionality [#79](https://github.com/azavea/iow-boundary-tool/pull/79)
- Create Remaining Initial Django Models [#82](https://github.com/azavea/iow-boundary-tool/pull/82)
- Add test submissions [#110](https://github.com/azavea/iow-boundary-tool/pull/110)
- Force users to reset password on first login [#83](https://github.com/azavea/iow-boundary-tool/pull/83)
- Style submissions list [#99](https://github.com/azavea/iow-boundary-tool/pull/99)
- Add RTK Query [#101](https://github.com/azavea/iow-boundary-tool/pull/101)
- Add navigation bar and logout button [#109](https://github.com/azavea/iow-boundary-tool/pull/109)
- Style submission detail page [#104](https://github.com/azavea/iow-boundary-tool/pull/104)
- Add ADR for REST API [#115](https://github.com/azavea/iow-boundary-tool/pull/115)
- Add boundary list and detail views/serializers [#113](https://github.com/azavea/iow-boundary-tool/pull/113) [#135](https://github.com/azavea/iow-boundary-tool/pull/135)
- Add other state boundaries [#111](https://github.com/azavea/iow-boundary-tool/pull/111)
- Configure Amazon SES email support in staging env [#118](https://github.com/azavea/iow-boundary-tool/pull/118)
- Wire up Boundary List Page [#122](https://github.com/azavea/iow-boundary-tool/pull/122)
- Add ReferenceImage views/serializers for image metadata [#114](https://github.com/azavea/iow-boundary-tool/pull/114)
- Load boundary details in draw page [#139](https://github.com/azavea/iow-boundary-tool/pull/139)
- Let users select utility at login [#142](https://github.com/azavea/iow-boundary-tool/pull/142)
- Add Activity Log Serializer [#140](https://github.com/azavea/iow-boundary-tool/pull/140)
- Implement boundary submission form [#147](https://github.com/azavea/iow-boundary-tool/pull/147)
- Save shape updates on draw page [#141](https://github.com/azavea/iow-boundary-tool/pull/141)
- Wire up boundary details page [#143](https://github.com/azavea/iow-boundary-tool/pull/143) [#152](https://github.com/azavea/iow-boundary-tool/pull/152)
- Add check for missing migrations [#153](https://github.com/azavea/iow-boundary-tool/pull/153)
- Save reference image metadata on draw page [#144](https://github.com/azavea/iow-boundary-tool/pull/144)
- Wire up create boundary [#145](https://github.com/azavea/iow-boundary-tool/pull/145)
- Add Draw page React context [#154](https://github.com/azavea/iow-boundary-tool/pull/154)
- Add User Permissions per Boundary [#156](https://github.com/azavea/iow-boundary-tool/pull/156)
- Handle boundaries with no shape [#173](https://github.com/azavea/iow-boundary-tool/pull/173)
- Add annotation support [#176](https://github.com/azavea/iow-boundary-tool/pull/176)
- Add "Needs Revision" test submission [#177](https://github.com/azavea/iow-boundary-tool/pull/177)
- Add support for uploading files [#175](https://github.com/azavea/iow-boundary-tool/pull/175)
- Add unapproving to data model [#178](https://github.com/azavea/iow-boundary-tool/pull/178)
- Add ability to submit reviews [#181](https://github.com/azavea/iow-boundary-tool/pull/181)
- Add format script and pre-commit hook [#179](https://github.com/azavea/iow-boundary-tool/pull/179)
- Add ability to resubmit boundaries [#185](https://github.com/azavea/iow-boundary-tool/pull/185)
- Add support for approving/unapproving boundaries [#186](https://github.com/azavea/iow-boundary-tool/pull/186)
- Add S3 Permissions to ECS Tasks [#199](https://github.com/azavea/iow-boundary-tool/pull/199)
- Add submit boundary validator email [#201](https://github.com/azavea/iow-boundary-tool/pull/201)
- Add Yellow color for In Review submissions [#202](https://github.com/azavea/iow-boundary-tool/pull/202)
- Add reference image opacity slider [#204](https://github.com/azavea/iow-boundary-tool/pull/204)
- Add contributor email notifications [#203](https://github.com/azavea/iow-boundary-tool/pull/203)
- Add contact info and send password reset email to user admin page [#208](https://github.com/azavea/iow-boundary-tool/pull/208)
- Add production enviroment for ecsmanage [#214](https://github.com/azavea/iow-boundary-tool/pull/214)
- Add Support for Exporting Boundaries [#218](https://github.com/azavea/iow-boundary-tool/pull/218)

### Changed

- Upgrade app container to use Node version 18 [#19](https://github.com/azavea/iow-boundary-tool/pull/19)
- Upgrade React to version 18 and add Chakra UI version 2 [#20](https://github.com/azavea/iow-boundary-tool/pull/20)
- Incorporated changes in app template [#31](https://github.com/azavea/iow-boundary-tool/pull/31)
- Update styles for Polygon and Municipal Boundary layers [#48](https://github.com/azavea/iow-boundary-tool/pull/48)
- Update tiles for all basemaps [#48](https://github.com/azavea/iow-boundary-tool/pull/48)
- Update Edit Polygon border to be lighter on dark backgrounds [#58](https://github.com/azavea/iow-boundary-tool/pull/58)
- Split DrawMap commponents into Layers and DrawTools [#57](https://github.com/azavea/iow-boundary-tool/pull/57)
- Make `Roles` enum an `IntEnum` subclass [#74](https://github.com/azavea/iow-boundary-tool/pull/74)
- Drop `Role` table and refactor as choice field on User [#117](https://github.com/azavea/iow-boundary-tool/pull/117)
- Return user information from login endpoint [#136](https://github.com/azavea/iow-boundary-tool/pull/136)
- Limit boundary list by contributor's selected utility [#148](https://github.com/azavea/iow-boundary-tool/pull/148)
- Guard Draw Page Actions [#156](https://github.com/azavea/iow-boundary-tool/pull/156)
- Only redirect to /welcome for new boundaries [#175](https://github.com/azavea/iow-boundary-tool/pull/175)
- Update File Upload UI [#198](https://github.com/azavea/iow-boundary-tool/pull/198)
- Update Download, Replace Polygon Workflows [#202](https://github.com/azavea/iow-boundary-tool/pull/202)
- Change draw page URL [#209](https://github.com/azavea/iow-boundary-tool/pull/209)
- Upgrading to terraform 1.1.9 and creating deployment README [#213](https://github.com/azavea/iow-boundary-tool/pull/213)
- Hide Add Map button for Validators [#218](https://github.com/azavea/iow-boundary-tool/pull/218)
- Automatically determine utility at utility-specific URLs [#218](https://github.com/azavea/iow-boundary-tool/pull/218)

### Fixed

- Fix react-remove-scroll-bar warning [#29](https://github.com/azavea/iow-boundary-tool/pull/29)
- Don't move reference image when panning map [#59](https://github.com/azavea/iow-boundary-tool/pull/59)
- Fix ansible task to use var defined in group_vars [#74](https://github.com/azavea/iow-boundary-tool/pull/74)
- Remove browser-dependent sizing of input elements [#100](https://github.com/azavea/iow-boundary-tool/pull/100)
- Update AWS_PROFILE env var [#105](https://github.com/azavea/iow-boundary-tool/pull/105)
- Prevent empty Map component from blocking submissions page from loading [#103](https://github.com/azavea/iow-boundary-tool/pull/103)
- Fix `./scripts/console database` [#121](https://github.com/azavea/iow-boundary-tool/pull/121)
- Fix add polygon [#169](https://github.com/azavea/iow-boundary-tool/pull/169)
- Fix user authentication [#170](https://github.com/azavea/iow-boundary-tool/pull/170)
- Fix view submission details link destination [#174](https://github.com/azavea/iow-boundary-tool/pull/174)
- Fix submit boundary [#195](https://github.com/azavea/iow-boundary-tool/pull/195)
- Fix contributor welcome redirect [#197](https://github.com/azavea/iow-boundary-tool/pull/197)
- Memoize shape update functions [#210](https://github.com/azavea/iow-boundary-tool/pull/210)
- GitHub Actions permissions issue workaround [#219](https://github.com/azavea/iow-boundary-tool/pull/219)
- Show correct utility in NavBar [#218](https://github.com/azavea/iow-boundary-tool/pull/218)


[Unreleased]: https://github.com/azavea/iow-boundary-tool/compare/0.9.1...HEAD
[0.9.1]: https://github.com/azavea/iow-boundary-tool/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/azavea/iow-boundary-tool/compare/0a16671...0.9.0
