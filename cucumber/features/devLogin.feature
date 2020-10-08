Feature: TTA Smarthub HSES login
 
    Scenario: Login is redirected to HSES
        When visiting https://tta-smarthub-dev.app.cloud.gov and pressing login
        Then we should see "Head Start Enterprise System"
