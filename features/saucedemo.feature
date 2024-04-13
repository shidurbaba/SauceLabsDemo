Feature: Saucedemo Regression Tests

  Scenario: Complete Shopping Experience
    Given I am on the Saucedemo login page
    When I login with valid credentials
    When I add specified items to the cart
    And I verify items against testData.csv
    And I remove an item from the cart
    And I proceed to checkout
    Then I should see the correct total price
    And I logout