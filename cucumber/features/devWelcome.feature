Feature: TTA Smarthub Welcome page
 
    Scenario: "Welcome to the TTA Smart Hub!" is displayed on the welcome page
        When visiting https://tta-smarthub-dev.app.cloud.gov/
        Then we should see "Welcome to the TTA Smart Hub!"
