Feature: TTA Smarthub Activity Report
    Scenario: Report can be filled out
        Given I am logged in
        And I am on the activity reports page
        Then I see "New activity report for Region 14" message
        When I select "Non-Grantee"
        Then I see "QRIS System" as an option in the "Who was this activity for?" multiselect
