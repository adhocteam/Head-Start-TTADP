Logical Data Model
==================

<img src="http://www.plantuml.com/plantuml/png/pLXVJnmt47_VJ-6t_b50KVjGAK9H22KLKaCGHpw0RptiEVLwtF7i9IVWknUlXRLUzi1tsz2-WEut___CUExUUPR4NMigNqi3ulNXRw-hwWSXrwYLS8HB0wqNNpMlXBID0ILgmgzUN0DmvV_IracIhJ3Q0cyS22HUOLNLHdelFdiWSLC9yRFGIhmHsZ8qGEBeg04B91dKsxSzUUN11-wpmEQPj6qotCeMXfI07tUyGjAimT-J997S74M6e7CiuLPeuRnhbq1365gfpH1WpGRU2B1T6-nW2vVGQBHdWm1-_FMNdyJbwOVJozFpazE5SDtIwFemClf3hNhVZVJy9pRQtWkoRi6pR5rFgGb2xCVyYD8vDK6vUqXej52MqZm1ISMYHWVxQ112WQz9EzPe4pehd0kWLdjV75BdWGhg41ecLO7sh9uFUIeGw_CPfEPMzkyEF9yI8VcIRA0B7pJQOOKwqiEFBV0AiucYQEOzgaqEUuVMmpRy11KaV6QWQARQxwcMlKAdwtAPP2RA5NKMeIafTj2QQir1_PbwJgRtOdw3_87IbEL02C-IEpz4Wi9h6h5f_u6mNRIIsAy0-8hbXP6XePQ81gITvN4isrDkDoXDGTA3YlyewUVmZHSCpgSGyWXapNgjUNC93ecVT-iuutzmpo93Dbm1kDeuc9wuhJ5Czmr9or0sShEI5IrjjJD-UVTUp4qCgAHn8cSK7Cr4H8X_bmoZGC6g2RHMUkvWP8aANLssctOEE4zLgLoGsdaivqyOskZrFZV9FDFvC9QO9_3OKTsVfDcpAfNIhD5ASuuCMPV5nlzqVI69TQrTo7Gs6mgCNWDjFZvwh5MNNdW5jMwboRep19VQE8DaYgpMJeFbi4mcpW2WF9M-MyPxp2xYjAGxs14s9DkWP-hOPaaDy0MwplGUJ_4GI8zsWk3op8p8SUDF4bW6VoOeDLg6RvoT_xA145HW_-8nJ30QzL7QUvpoecMaNS_DVKvK8pr_ZhtwVlETxzlP0_jf-GL2UnNEwmxB9Bh6cWsaMhoATRuWN6i5AiD76_tLlxCD1dDQ5k7u1X3x704xRUeeOjFcB90xJyop6o1t_mIDaKiaoKWlaw_T1os8R77_s3d2DVoVNK-TdfQnHVu-Rs2OmXVDn8xROOlRQIMzgE_uOBL0G_9mnlI5TX2tjmTu8-8gZyWT7XpStWn-IgdYBpoFyIWrHK2J-FilJbN_LzpTzb38VXMtHs9B9smL_Zn2eyh3Gn7-3rHEGz5eqZP2ek4GUJBn44g6vLKAIhPlgfYw9raczALlWy_QocBPHehf7P4ZAPOvTKsrhTzZtiiPStBMKoDI_Z7ZoTx8M9z0doOFxljjF6DRkQVPcgxUWLLTQ_u1" alt="logical data model diagram">

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
  * submissionStatus : enum
  programTypes : array<string>
  targetPopulations : array<string>
  reason : array<string>
  participants : array<string>
  topics : array<string>
  ttaType : array<string>
  context : string
  pageState : json
  oldManagerNotes : string
  oldManagerId : integer(32) REFERENCES public.Users.id
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
  * createdAt : timestamp
  * updatedAt : timestamp
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

1. [Edit this diagram with plantuml.com](http://www.plantuml.com/plantuml/png/pLXVJnmt47_VJ-6t_b50KVjGAK9H22KLKaCGHpw0RptiEVLwtF7i9IVWknUlXRLUzi1tsz2-WEut___CUExUUPR4NMigNqi3ulNXRw-hwWSXrwYLS8HB0wqNNpMlXBID0ILgmgzUN0DmvV_IracIhJ3Q0cyS22HUOLNLHdelFdiWSLC9yRFGIhmHsZ8qGEBeg04B91dKsxSzUUN11-wpmEQPj6qotCeMXfI07tUyGjAimT-J997S74M6e7CiuLPeuRnhbq1365gfpH1WpGRU2B1T6-nW2vVGQBHdWm1-_FMNdyJbwOVJozFpazE5SDtIwFemClf3hNhVZVJy9pRQtWkoRi6pR5rFgGb2xCVyYD8vDK6vUqXej52MqZm1ISMYHWVxQ112WQz9EzPe4pehd0kWLdjV75BdWGhg41ecLO7sh9uFUIeGw_CPfEPMzkyEF9yI8VcIRA0B7pJQOOKwqiEFBV0AiucYQEOzgaqEUuVMmpRy11KaV6QWQARQxwcMlKAdwtAPP2RA5NKMeIafTj2QQir1_PbwJgRtOdw3_87IbEL02C-IEpz4Wi9h6h5f_u6mNRIIsAy0-8hbXP6XePQ81gITvN4isrDkDoXDGTA3YlyewUVmZHSCpgSGyWXapNgjUNC93ecVT-iuutzmpo93Dbm1kDeuc9wuhJ5Czmr9or0sShEI5IrjjJD-UVTUp4qCgAHn8cSK7Cr4H8X_bmoZGC6g2RHMUkvWP8aANLssctOEE4zLgLoGsdaivqyOskZrFZV9FDFvC9QO9_3OKTsVfDcpAfNIhD5ASuuCMPV5nlzqVI69TQrTo7Gs6mgCNWDjFZvwh5MNNdW5jMwboRep19VQE8DaYgpMJeFbi4mcpW2WF9M-MyPxp2xYjAGxs14s9DkWP-hOPaaDy0MwplGUJ_4GI8zsWk3op8p8SUDF4bW6VoOeDLg6RvoT_xA145HW_-8nJ30QzL7QUvpoecMaNS_DVKvK8pr_ZhtwVlETxzlP0_jf-GL2UnNEwmxB9Bh6cWsaMhoATRuWN6i5AiD76_tLlxCD1dDQ5k7u1X3x704xRUeeOjFcB90xJyop6o1t_mIDaKiaoKWlaw_T1os8R77_s3d2DVoVNK-TdfQnHVu-Rs2OmXVDn8xROOlRQIMzgE_uOBL0G_9mnlI5TX2tjmTu8-8gZyWT7XpStWn-IgdYBpoFyIWrHK2J-FilJbN_LzpTzb38VXMtHs9B9smL_Zn2eyh3Gn7-3rHEGz5eqZP2ek4GUJBn44g6vLKAIhPlgfYw9raczALlWy_QocBPHehf7P4ZAPOvTKsrhTzZtiiPStBMKoDI_Z7ZoTx8M9z0doOFxljjF6DRkQVPcgxUWLLTQ_u1)
2. Copy and paste the final UML into the UML Source section
3. Update the img src and edit link target to the current values

### Notes

* See the help docs for [Entity Relationship Diagram](https://plantuml.com/ie-diagram) and [Class Diagram](https://plantuml.com/class-diagram) for syntax help.
* We're using the `*` visibility modifier to denote fields that cannot be `null`.
