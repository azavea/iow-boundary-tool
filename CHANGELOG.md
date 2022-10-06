# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Force users to reset password on first login [#83](https://github.com/azavea/iow-boundary-tool/pull/83)
- Style submissions list [#99](https://github.com/azavea/iow-boundary-tool/pull/99)
- Add RTK Query [#101](https://github.com/azavea/iow-boundary-tool/pull/101)
- Add navigation bar and logout button [#109](https://github.com/azavea/iow-boundary-tool/pull/109)
- Style submission detail page [#104](https://github.com/azavea/iow-boundary-tool/pull/104)

### Changed

- Upgrade app container to use Node version 18 [#19](https://github.com/azavea/iow-boundary-tool/pull/19)
- Upgrade React to version 18 and add Chakra UI version 2 [#20](https://github.com/azavea/iow-boundary-tool/pull/20)
- Incorporated changes in app template [#31](https://github.com/azavea/iow-boundary-tool/pull/31)
- Update styles for Polygon and Municipal Boundary layers [#48](https://github.com/azavea/iow-boundary-tool/pull/48)
- Update tiles for all basemaps [#48](https://github.com/azavea/iow-boundary-tool/pull/48)
- Update Edit Polygon border to be lighter on dark backgrounds [#58](https://github.com/azavea/iow-boundary-tool/pull/58)
- Split DrawMap commponents into Layers and DrawTools [#57](https://github.com/azavea/iow-boundary-tool/pull/57)
- Make `Roles` enum an `IntEnum` subclass [#74](https://github.com/azavea/iow-boundary-tool/pull/74)

### Fixed

- Fix react-remove-scroll-bar warning [#29](https://github.com/azavea/iow-boundary-tool/pull/29)
- Don't move reference image when panning map [#59](https://github.com/azavea/iow-boundary-tool/pull/59)
- Fix ansible task to use var defined in group_vars [#74](https://github.com/azavea/iow-boundary-tool/pull/74)
- Remove browser-dependent sizing of input elements [#100](https://github.com/azavea/iow-boundary-tool/pull/100)
- Update AWS_PROFILE env var [#105](https://github.com/azavea/iow-boundary-tool/pull/105)
- Prevent empty Map component from blocking submissions page from loading [#103](https://github.com/azavea/iow-boundary-tool/pull/103)

### Deprecated

### Removed

### Security

[Unreleased]: https://github.com/azavea/iow-boundary-tool/tree/HEAD
