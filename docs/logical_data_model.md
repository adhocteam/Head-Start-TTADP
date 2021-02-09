Logical Data Model
==================

<img src="http://www.plantuml.com/plantuml/png/nLTVRzis47_Nf-3RjW8nXWt3W28escRka8TbGPn-05gwoDn87dSyfJNYVFU9OcQPbfmoqhQ-9D3l_l3knn-Fz5lFahWnkl2br22-N_pyKr5y8-GzgaeumhK6uyKdnHiXRQsX4YNX9o_k0BZmVohh94aZjBB0MmS2YJTO5AMMtekF7aWy54Ay4cssrq9PXhg5pizhi42IeNhpfZLlFFZWUncSF9EoTOjQQU3msstGmbLZra0z77A3aKeVGgnOmsi1jZ4XEnguWLgXlJmeujiVV_XEt2m_B6-MLnVBbN3DMgjo4HtzGbLTwf8WLFcEsq1M1ZnBupfBuweHo-C_hSSyESs_IXljKwnAT30bWn0L-9AKOuMsH-UqSmrabFVPBJKUA8FjiEbxhcdY7ld0KqPOn-U_iRD_DIss94BoEMoW2nyAxU4EDQGEFmtm1XFrKrpcFLRR5FOEhOTJ-0LMqEFp6aKz9h_d97kBJfLPCUaoCIvBMOGQSZI2kjzh3kalgo_5T5NC5yYlA7KU1q9ubjpuGoGalACZD-K_49gLaSH-0y2tBA-r389Q8sgGTbx5NUFFbLstjWpIGuglHFeLVEOLW-jFPDg1B5dTAzxUW4FYBvVrBl4FvVLZxKLJpI93SXu3SBjrC7v8JxOzBZMIbY7lbCxYDwvqSft1fJnrbjUneHojHSyOE3X60I7-HJ8SDGgs6g3pYGd2pnXVKnfCgScD2r4JJkxSGuWsLZtnsJ9ZwVIyvYnFuB6Xidjv9ZUlh2eLhckfhv0XKLKK-kztrv9ObSe5ffEpK85Mzq3RtmRtUTNi7m4LbCf8dQWnDBUNRGBrawjTK87bC3n6NWh7h-BXcN24DKaJuWCkYUJsF5e38Iof1hv6r-YkqZ4V0kdHZXXSoiYHELu6emQMiP-1fKJBy9cJ1cGDAuxi_E7Hjf2HjWKftQd9Jr0jFN-CGdk__O_VhqzXyoNVYp5BzyExK4ov35yqZcA8tO-7ZBX-bimcAYt_0hMMQoJ9IFyZNoyIP0WPBp_tgfbVzeGRvAdiq87OxSxmGKIfH-GHpyvs3mS_9Olu2tU8nwWn0-gzV_TmBBg_ud7NGQ668gfcxxQ_dulmPu36b8k52FyFKev3ST4-Muh4XKFd-oMUMacnbEUGvBH28tLPBlqRUBZ2ixOKIRexPOg47vcJdJyofP-9JpB18el1Fcxkny9fdxTWgyRelm40">

UML Source
----------

```
@startuml
scale 0.75

' avoid problems with angled crows feet
skinparam linetype ortho

class User {
  * id : integer <<generated>>
  hsesUserId : string
  name : string
  phoneNumber : string
  * email : string
  title: enum
  homeRegionId : integer(32) REFERENCES public.Regions.id
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
  * userId: integer(32) REFERENCES public.Users.id
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
  * status : string
  programTypes : array<string>
  targetPopulations : array<string>
  reason : array<string>
  participants : array<string>
  topics : array<string>
  ttaType : array<string>
  context : string
  pageState : json
  managerNotes : string
  * userId : integer(32) REFERENCES public.Users.id
  * lastUpdatedById : integer(32) REFERENCES public.Users.id
  * regionId : integer(32) REFERENCES public.Region.id
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

class ActivityReportGoal {
  * id : integer <<generated>>
  * activityReportId : integer(32) REFERENCES public.ActivityReport.id
  * goalId : integer(32) REFERENCES public.Goal.id
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
User .. NextSteps
ActivityReport .. NextSteps
ActivityReport .. ActivityReportGoal
Goal .. ActivityReportGoal
Goal }|--|{ ActivityReport

User ||-o{ ActivityReport
ActivityReport ||-o{ ActivityParticipant
Grant ||-{ ActivityParticipant
NonGrantee ||-{ ActivityParticipant
@enduml
```

Instructions
------------

1. [Edit this diagram with plantuml.com](http://www.plantuml.com/plantuml/uml/nLTVRzis47_Nf-3RjW8nXWt3W28escRka8TbGPn-05gwoDn87dSyfJNYVFU9OcQPbfmoqhQ-9D3l_l3knn-Fz5lFahWnkl2br22-N_pyKr5y8-GzgaeumhK6uyKdnHiXRQsX4YNX9o_k0BZmVohh94aZjBB0MmS2YJTO5AMMtekF7aWy54Ay4cssrq9PXhg5pizhi42IeNhpfZLlFFZWUncSF9EoTOjQQU3msstGmbLZra0z77A3aKeVGgnOmsi1jZ4XEnguWLgXlJmeujiVV_XEt2m_B6-MLnVBbN3DMgjo4HtzGbLTwf8WLFcEsq1M1ZnBupfBuweHo-C_hSSyESs_IXljKwnAT30bWn0L-9AKOuMsH-UqSmrabFVPBJKUA8FjiEbxhcdY7ld0KqPOn-U_iRD_DIss94BoEMoW2nyAxU4EDQGEFmtm1XFrKrpcFLRR5FOEhOTJ-0LMqEFp6aKz9h_d97kBJfLPCUaoCIvBMOGQSZI2kjzh3kalgo_5T5NC5yYlA7KU1q9ubjpuGoGalACZD-K_49gLaSH-0y2tBA-r389Q8sgGTbx5NUFFbLstjWpIGuglHFeLVEOLW-jFPDg1B5dTAzxUW4FYBvVrBl4FvVLZxKLJpI93SXu3SBjrC7v8JxOzBZMIbY7lbCxYDwvqSft1fJnrbjUneHojHSyOE3X60I7-HJ8SDGgs6g3pYGd2pnXVKnfCgScD2r4JJkxSGuWsLZtnsJ9ZwVIyvYnFuB6Xidjv9ZUlh2eLhckfhv0XKLKK-kztrv9ObSe5ffEpK85Mzq3RtmRtUTNi7m4LbCf8dQWnDBUNRGBrawjTK87bC3n6NWh7h-BXcN24DKaJuWCkYUJsF5e38Iof1hv6r-YkqZ4V0kdHZXXSoiYHELu6emQMiP-1fKJBy9cJ1cGDAuxi_E7Hjf2HjWKftQd9Jr0jFN-CGdk__O_VhqzXyoNVYp5BzyExK4ov35yqZcA8tO-7ZBX-bimcAYt_0hMMQoJ9IFyZNoyIP0WPBp_tgfbVzeGRvAdiq87OxSxmGKIfH-GHpyvs3mS_9Olu2tU8nwWn0-gzV_TmBBg_ud7NGQ668gfcxxQ_dulmPu36b8k52FyFKev3ST4-Muh4XKFd-oMUMacnbEUGvBH28tLPBlqRUBZ2ixOKIRexPOg47vcJdJyofP-9JpB18el1Fcxkny9fdxTWgyRelm40)
2. Copy and paste the final UML into the UML Source section
3. Update the img src and edit link target to the current values

### Notes

* See the help docs for [Entity Relationship Diagram](https://plantuml.com/ie-diagram) and [Class Diagram](https://plantuml.com/class-diagram) for syntax help.
* We're using the `*` visibility modifier to denote fields that cannot be `null`.
