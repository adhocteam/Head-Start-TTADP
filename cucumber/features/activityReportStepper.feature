Feature: Activity Report Stepper
 
    Scenario: Activity Summary
        Given a user is logged in
        And the current page is the activity reports page
        Then we see the Stepper
        And the first step is the Activity Summary
    Scenario: Navigation buttons
        Given a user is logged in
        And the current page is the activity reports page
        Then two navigation buttons are visible
        And the "Previous" button is disabled
        When the "Next" button is clicked
        Then the "Previous" button is no longer disabled
     Scenario: Progress
        Given a user is logged in
        And the current page is the activity reports page
        When the "Next" button is clicked
        Then the "Activity Summary" step is no longer current
        And the "Participants" step is current
        When the "Next" button is clicked again
        Then the "Participants" step is still current, but on page 2
        And the "Goals & Objectives" step is not yet reached
        When the "Previous" button is clicked
        Then the "Participants" step is still current, but on page 1
        When the "Previous" button is clicked again
        Then the "Participants" step is not current
        And the "Activity Summary" step is now current
