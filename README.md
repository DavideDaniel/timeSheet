# Timesheet Chrome Extension - Internal Tool

#### Overview
* No more tedious figuring out military time conversions
* Actually calculating based on present fields

#### Updates
---
* Vacation and holiday buckets added
*
* Importing hours from OA report of week via the extension - now based on consensus around billable hours
* Import button now enables auto calculation of military times as well


#### To Use
* Once installed and enabled, just create an Oracle timesheet, load up a template and instead of filling in the `Start` & `Stop` fields, fill in the `Hrs` you got from OpenAir.
* To import hours from OA
  - Open up your week's timesheet & go to the report for that week
  - Navigate to your Oracle time sheet on another tab, then open the extension popup and click import

#### Installation
---
* Clone or download the repo
* Go to chrome://extensions/
* Tick "Developer mode" checkbox
* Drag drop the mm-time.crx file onto the chrome://extensions page

#### Current buckets
---

|Billable Time |
|----
| Billable
| Client - Non-Billable

|Internal Time:
|---
|Maxymiser Comms/Email
|Maxymiser Meeting/Calls

|Admin Time:
|---
|Maxymiser Personal Admin

|Unassigned Time:
|---
|Maxymiser + not Internal Time + not Vacation + not Holiday

|Vacation:
|---
|Maxymiser Vacation

|Holiday:
|---
|Maxymiser Bank Holiday

#### TODO
---
* Update UI
* Option to customize buckets maybe
