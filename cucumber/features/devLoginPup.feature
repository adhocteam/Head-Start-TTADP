Feature: TTA Smarthub HSES login
 
    Scenario: Login is redirected to HSES
        Given https://tta-smarthub-dev.app.cloud.gov
        When pressing login
        Then we should see "Head Start Enterprise System" page
