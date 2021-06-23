const AR_PLUS_RELATED_QUERY = `
WITH collaborators AS (
    SELECT
        a."activityReportId" AS "activityReportId",
        jsonb_agg("Users") AS "collaborators"
    FROM
        "ActivityReportCollaborators" AS a
        INNER JOIN "Users" ON a."userId" = "Users"."id"
    WHERE
        a."activityReportId" = $1
    GROUP BY
        a."activityReportId"
),
recipients AS (
    SELECT
        jsonb_agg(t) AS "activityRecipients",
        t."activityReportId"
    FROM (
        SELECT
            a.*,
            to_jsonb ("Grants") AS "grant",
            to_jsonb ("Grantees") AS "grantee",
            to_jsonb ("NonGrantees") AS "nonGrantee"
        FROM
            "ActivityRecipients" AS a
        LEFT JOIN "Grants" ON "Grants"."id" = a."grantId"
        LEFT JOIN "Grantees" ON "Grantees"."id" = "Grants"."granteeId"
        LEFT JOIN "NonGrantees" ON "NonGrantees"."id" = a."nonGranteeId"
    WHERE
        a."activityReportId" = $1) AS t
GROUP BY
    t."activityReportId"
),
goals as (
    SELECT
    DISTINCT ON ("Goals"."id")
        "Goals".*,
        o.id AS "objectiveId"
    FROM
        "Goals"
        LEFT JOIN "Objectives" as o
    ON "Goals"."id" = o."goalId"
),
objectives AS (
    SELECT
        o.*,
        to_jsonb ("Goals") AS "goal"
    FROM
        "Objectives" AS o
        LEFT JOIN "Goals" ON "Goals"."id" = o."goalId"
),
objectivesWithGoals AS (
    SELECT
        *
    FROM
        objectives
    WHERE
        objectives."goalId" IS NOT NULL
),
objectivesWithoutGoals AS (
    SELECT
        *
    FROM
        objectives
    WHERE
        objectives."goalId" IS NULL
),
actitvityReportObjectives AS (
    SELECT
        a."activityReportId",
        -- aggregate objectivesWithGoals and objectivesWithoutGoals, FILTER out null values
        jsonb_agg(objectivesWithGoals) FILTER (WHERE objectivesWithGoals.id IS NOT NULL) AS "objectivesWithGoals",
        jsonb_agg(objectivesWithoutGoals) FILTER (WHERE objectivesWithoutGoals.id IS NOT NULL) AS "objectivesWithoutGoals",
        jsonb_agg(goals) FILTER (WHERE goals.id IS NOT NULL) AS "goals"
    FROM
        "ActivityReportObjectives" AS a
        LEFT JOIN objectivesWithGoals ON objectivesWithGoals."id" = a."objectiveId"
        LEFT JOIN objectivesWithoutGoals ON objectivesWithoutGoals."id" = a."objectiveId"
        LEFT JOIN goals ON goals."objectiveId" = a."objectiveId"
    WHERE
        a."activityReportId" = $1
    GROUP BY
        a."activityReportId"
),
author AS (
    SELECT
        a."id" AS "activityReportId",
        to_jsonb ("Users") AS "author"
    FROM
        "ActivityReports" AS a
        LEFT JOIN "Users" ON "Users".id = a."userId"
    WHERE
        a."id" = $1
),
attachments AS (
    SELECT
        a."id" AS "activityReportId",
        jsonb_agg("Files") AS "attachments"
    FROM
        "ActivityReports" AS a
        LEFT JOIN "Files" ON "Files"."activityReportId" = a.id
    WHERE
        a."id" = $1
        AND "Files"."status" != 'UPLOAD_FAILED'
    GROUP BY
        a."id"
),
specialistNextSteps AS (
    SELECT
        a."id" AS "activityReportId",
        jsonb_agg("NextSteps") AS "specialistNextSteps"
    FROM
        "ActivityReports" AS a
        LEFT JOIN "NextSteps" ON "NextSteps"."activityReportId" = a.id
    WHERE
        a."id" = $1
        AND "NextSteps"."noteType" = 'SPECIALIST'
    GROUP BY
        a."id"
),
granteeNextSteps AS (
    SELECT
        a."id" AS "activityReportId",
        jsonb_agg("NextSteps") AS "granteeNextSteps"
    FROM
        "ActivityReports" AS a
        LEFT JOIN "NextSteps" ON "NextSteps"."activityReportId" = a.id
    WHERE
        a."id" = $1
        AND "NextSteps"."noteType" = 'GRANTEE'
    GROUP BY
        a."id"
),
approvingManager AS (
    SELECT
        a."id" AS "activityReportId",
        to_jsonb("Users") AS "approvingManager"
    FROM
        "ActivityReports" AS a
        LEFT JOIN "Users" ON "Users".id = a."approvingManagerId"
    WHERE
        a."id" = $1
)
SELECT
    "ActivityReports".*,
    format('R%s-AR-%s', to_char("ActivityReports"."regionId", 'FM00'), "ActivityReports"."id") AS "displayId",
    "collaborators",
    "activityRecipients",
    "objectivesWithGoals",
    "objectivesWithoutGoals",
    "goals",
    "author",
    "attachments",
    "specialistNextSteps",
    "granteeNextSteps",
    "approvingManager"
FROM
    "ActivityReports"
    LEFT OUTER JOIN collaborators ON "ActivityReports".id = collaborators."activityReportId"
    LEFT OUTER JOIN recipients ON "ActivityReports".id = recipients."activityReportId"
    LEFT OUTER JOIN actitvityReportObjectives ON "ActivityReports".id = actitvityReportObjectives."activityReportId"
    LEFT OUTER JOIN author ON "ActivityReports".id = author."activityReportId"
    LEFT OUTER JOIN attachments ON "ActivityReports".id = attachments."activityReportId"
    LEFT OUTER JOIN specialistNextSteps ON "ActivityReports".id = specialistNextSteps."activityReportId"
    LEFT OUTER JOIN granteeNextSteps ON "ActivityReports".id = granteeNextSteps."activityReportId"
    LEFT OUTER JOIN approvingManager ON "ActivityReports".id = approvingManager."activityReportId"
WHERE
    "ActivityReports"."id" = $1;
`;

export { AR_PLUS_RELATED_QUERY as default };
