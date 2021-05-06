Logical Data Model
==================

<img src="http://www.plantuml.com/plantuml/png/pLZDRjms4BxhANZh3neZQ0y50YE8upg5WSOnRES1kE9OovJYiCEHauNjTw-vnDAYBDcqrBgzx4BV_F_CQ7RVUPR4NMigNqi3ulNUhw-hwZiXhr0huGXN1bellcfU2saR0qhKX5-zk0JWol-fhPCaMs6q1Tuu44YyngggZVHUVFP0uheIuaUXbNWZj6LeWCJ-VWCMI3Aejs-tvBK77xYF0vjdqhR9S2jRw5C2Vj3n6acp1dz7aaHoinyPWiwXX5kZXPEkNG7rOMYbDds0DHju8y1sRR23BPn1ez4UzmBu_fUVVn1dHn-EpevE3e_EXUjMHjTxaT7lQRNrtKZFVs2ZxPqWwnOyozPjAJL1YFs07r0wfqOejxk4HWjbASqJa5ISr-XWZWOX5FYQj6EDDg6BmZa5QhNtnI5r7gYW3g5XKXLePlLyo5E1s3QVKMfPPV_gmFCH4P8loGQwyA3HzYlKaUu_ji1hp2QAefdtg3Ovx1rQ3rFu8If8-C90qOortsCjUu5Er-KooKoKA-eiGbDIxA0rrPg3-cFrbCpMY-KDyZjAKvO38JnBxdmV2GelQS2c_GV2zhoLn7uDm1SiJuqC3RL2D23j8ezZsHvpkq5f2f8ULFn7IJ-1RtpEuEudCez0rgolD6_Em27nqsuTPFmxzomoPCCLW8kDW_69cunXl6z8MeR2aLkIh6XfqixmpJjxCJSne9B6YPnHS30J4I7-JJ8C0WMhHj1QwNmm5YOgT7N1RfeJS9wgKhaeDMyi5qmOskZrp9jaWUby64lC4tZigDwUfDbhLIgbMQELvWGPiYwBZV_fybGIwrgxaEbiDXGOVGMq-VZWPQswz8PNKEjMcgmxGt1P6oT8fiXgxJHO3ijav0m0obAvcv5q_Jh2XcGRfCTER9RK09-YwypMpp4U0kdHZX1Sdey1EUxvKGBBuCy8fKRBy8sperysSCunDryyXharqCXwyr7QEnBbrKhK0-S8h-wGoFRictFEdMgavy-nOTzl_kKZT_7KVbfzWT1Z1KFxp8qINMFDvhvXVufbFmqrKQ0oFBLiWlw9bT0Rrh88XuU0c749F6zTHn6RrcU1tFskNTm0kVk7Q8nS8Kb6Uf5ypHYq83BXVXnt-3-xdZezxMQBV3yXKv65YNgfgEPC-eJRQRsygE-uirgW8NcuO992QSNDpIky5d4jH-GMNxswkUxzDrB5lsmUub5gZ80cyMz_2LNRJt5xiuL2zgku2H9RkachyF40ZIhtzaJuxgiSXQBHf6s0HCCXycHY5qg6vLKAIgQtJapTeomZ-jBFkoTjPR5CaM9w1-H8YcLENLDDzNlCUpbZJivwQa3A7pEUx7qNwnFeu-JUmJx9Cx2LUvgjtEeTMDMrvcy0" alt="logical data model diagram">

UML Source
----------

```
@startuml
scale 0.70

' avoid problems with angled crows feet
skinparam linetype ortho

class User {
  * id : integer <<generated>>
  * hsesUserId : string
  * hsesUsername : string
  hsesAuthorities : array<string>
  name : string
  phoneNumber : string
  email : string
  title: enum
  homeRegionId : integer(32) REFERENCES public.Regions.id
  * lastLogin : timestamp
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Region {
  * id : integer <<generated>>
  * name : string
}

class Scope {
  * id : integer <<generated>>
  * name : string
  description: string
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Permission {
  * id : integer <<generated>>
  * userId : integer(32) REFERENCES public.Users.id
  * regionId : integer(32) REFERENCES public.Regions.id
  * scopeId : integer(32) REFERENCES public.Scopes.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class RequestErrors {
  * id : integer <<generated>>
  operation : string
  uri : string
  method : string
  requestBody : string
  responseBody : string
  responseCode : string
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Role {
  * id : integer
  * name : string
}

class Topic {
  * id : integer
  * name : string
}

class RoleTopic {
  * id : integer <<generated>>
  * roleId : integer(32) REFERENCES public.Roles.id
  * topicId: integer(32) REFERENCES public.Topics.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Goal {
  * id : integer
  * name : string
  status : string
  timeframe : string
  isFromSmartsheetTtaPlan : boolean
  * createdAt : timestamp
  * updatedAt : timestamp
}

class TopicGoal {
  * id : integer
  * goalId : integer(32) REFERENCES public.Goals.id
  * topicId: integer(32) REFERENCES public.Topics.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class NextSteps {
  * id: integer
  * activityReportId: integer(32) REFERENCES public.ActivityReport.id
  * note: string
  * noteType: string
  * createdAt: timestamp
  * updatedAt: timestamp
}

class Grantee {
  * id : integer
  * name : string
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Grant {
  * id : integer
  * number : string
  regionId : integer(32) REFERENCES public.Regions.id
  * granteeId : integer(32) REFERENCES public.Grantee.id
  status : string
  startDate : timestamp
  endDate : timestamp
  cdi : boolean
  * createdAt : timestamp
  * updatedAt : timestamp
}

class GrantGoal {
  * id : integer <<generated>>
  * granteeId : integer(32) REFERENCES public.Grantees.id
  * grantId : integer(32) REFERENCES public.Grants.id
  * goalId : integer(32) REFERENCES public.Goals.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class NonGrantee {
  * id : integer <<generated>>
  * name : string
  * createdAt : timestamp
  * updatedAt : timestamp
}

class ActivityReport {
  * id : integer <<generated>>
  resourcesUsed : string
  additionalNotes : string
  numberOfParticipants : integer
  deliveryMethod : string
  duration : decimal
  endDate : date
  startDate : date
  activityRecipientType : string
  requester : string
  * status : enum
  programTypes : array<string>
  targetPopulations : array<string>
  reason : array<string>
  participants : array<string>
  topics : array<string>
  ttaType : array<string>
  context : string
  pageState : json
  legacyManagerNotes : string
  legacyApprovingManagerId : integer(32) REFERENCES public.Users.id
  * userId : integer(32) REFERENCES public.Users.id
  * lastUpdatedById : integer(32) REFERENCES public.Users.id
  * regionId : integer(32) REFERENCES public.Region.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class Objective {
  * id : integer <<generated>>
  * goalId : integer(32) REFERENCES public.Goal.id
  title : string,
  ttaProvided : string,
  status : string,
  * createdAt : timestamp
  * updatedAt : timestamp
}

class ActivityParticipant {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  grantId : integer(32) REFERENCES public.Grant.id
  nonGranteeId : integer(32) REFERENCES public.NonGrantee.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

class ActivityReportCollaborator {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  * userId : integer(32) REFERENCES public.User.id
}

class ActivityReportApprover {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  * userId : integer(32) REFERENCES public.User.id
  status: enum
  note : string
}

class ActivityReportGoal {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  * goalId : integer(32) REFERENCES public.Goal.id
}

class ActivityReportObjective {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  * objectiveId : integer(32) REFERENCES public.Objective.id
  * createdAt : timestamp
  * updatedAt : timestamp
}

User ||-o{ Region
User }o--|{ Permission
Scope }o--|{ Permission
Region }o--|{ Permission
Role }o--|{ Topic
Topic }|--|{ Goal
Grantee }o--|{ GrantGoal
Goal }o--|{ GrantGoal
Role .. RoleTopic
Topic .. RoleTopic
Topic .. TopicGoal
Goal .. TopicGoal
Grantee ||--|{ Grant
Region ||--|{ Grant
ActivityReport .. ActivityReportCollaborator
User .. ActivityReportCollaborator
ActivityReport .. NextSteps
ActivityReport .. ActivityReportGoal
Goal .. ActivityReportGoal
Goal }|--|{ ActivityReport
Goal ||-o{ Objective
ActivityReportObjective }o--|{ Objective
ActivityReportObjective }o--|{ ActivityReport

User ||-o{ ActivityReport
ActivityReport ||-o{ ActivityParticipant
Grant ||-{ ActivityParticipant
NonGrantee ||-{ ActivityParticipant
ActivityReport --|{ ActivityReportApprover
@enduml
```

Instructions
------------

1. [Edit this diagram with plantuml.com](http://www.plantuml.com/plantuml/uml/pLZDRjms4BxhANZh3neZQ0y50YE8upg5WSOnRES1kE9OovJYiCEHauNjTw-vnDAYBDcqrBgzx4BV_F_CQ7RVUPR4NMigNqi3ulNUhw-hwZiXhr0huGXN1bellcfU2saR0qhKX5-zk0JWol-fhPCaMs6q1Tuu44YyngggZVHUVFP0uheIuaUXbNWZj6LeWCJ-VWCMI3Aejs-tvBK77xYF0vjdqhR9S2jRw5C2Vj3n6acp1dz7aaHoinyPWiwXX5kZXPEkNG7rOMYbDds0DHju8y1sRR23BPn1ez4UzmBu_fUVVn1dHn-EpevE3e_EXUjMHjTxaT7lQRNrtKZFVs2ZxPqWwnOyozPjAJL1YFs07r0wfqOejxk4HWjbASqJa5ISr-XWZWOX5FYQj6EDDg6BmZa5QhNtnI5r7gYW3g5XKXLePlLyo5E1s3QVKMfPPV_gmFCH4P8loGQwyA3HzYlKaUu_ji1hp2QAefdtg3Ovx1rQ3rFu8If8-C90qOortsCjUu5Er-KooKoKA-eiGbDIxA0rrPg3-cFrbCpMY-KDyZjAKvO38JnBxdmV2GelQS2c_GV2zhoLn7uDm1SiJuqC3RL2D23j8ezZsHvpkq5f2f8ULFn7IJ-1RtpEuEudCez0rgolD6_Em27nqsuTPFmxzomoPCCLW8kDW_69cunXl6z8MeR2aLkIh6XfqixmpJjxCJSne9B6YPnHS30J4I7-JJ8C0WMhHj1QwNmm5YOgT7N1RfeJS9wgKhaeDMyi5qmOskZrp9jaWUby64lC4tZigDwUfDbhLIgbMQELvWGPiYwBZV_fybGIwrgxaEbiDXGOVGMq-VZWPQswz8PNKEjMcgmxGt1P6oT8fiXgxJHO3ijav0m0obAvcv5q_Jh2XcGRfCTER9RK09-YwypMpp4U0kdHZX1Sdey1EUxvKGBBuCy8fKRBy8sperysSCunDryyXharqCXwyr7QEnBbrKhK0-S8h-wGoFRictFEdMgavy-nOTzl_kKZT_7KVbfzWT1Z1KFxp8qINMFDvhvXVufbFmqrKQ0oFBLiWlw9bT0Rrh88XuU0c749F6zTHn6RrcU1tFskNTm0kVk7Q8nS8Kb6Uf5ypHYq83BXVXnt-3-xdZezxMQBV3yXKv65YNgfgEPC-eJRQRsygE-uirgW8NcuO992QSNDpIky5d4jH-GMNxswkUxzDrB5lsmUub5gZ80cyMz_2LNRJt5xiuL2zgku2H9RkachyF40ZIhtzaJuxgiSXQBHf6s0HCCXycHY5qg6vLKAIgQtJapTeomZ-jBFkoTjPR5CaM9w1-H8YcLENLDDzNlCUpbZJivwQa3A7pEUx7qNwnFeu-JUmJx9Cx2LUvgjtEeTMDMrvcy0)
2. Copy and paste the final UML into the UML Source section
3. Update the img src and edit link target to the current values

### Notes

* See the help docs for [Entity Relationship Diagram](https://plantuml.com/ie-diagram) and [Class Diagram](https://plantuml.com/class-diagram) for syntax help.
* We're using the `*` visibility modifier to denote fields that cannot be `null`.
