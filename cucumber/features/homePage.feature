Feature: TTA Smarthub Home Page
 
    Scenario: Welcome page is displayed
        Given a user is logged in
        And and on the home page of tta-smarthub
        Then we should see "Welcome to the TTA Smart Hub" message
        And we should see "Activity Reports" link
    # Scenario: Login is redirected to HSES
    #     Given the home page of tta-smarthub
    #     When pressing login
    #     Then we should see "Head Start Enterprise System" page
