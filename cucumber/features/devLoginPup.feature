Feature: TTA Smarthub HSES login
 
    Scenario: Welcome page is displayed
        When visiting https://tta-smarthub-dev.app.cloud.gov
        Then we should see "Welcome to the TTA Smart Hub!" message
    Scenario: Login is redirected to HSES
        Given https://tta-smarthub-dev.app.cloud.gov
        When pressing login
        Then we should see "Head Start Enterprise System" page
