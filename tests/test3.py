# Test login and logout with multiple ids 

import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"

# Set up Firefox options
firefox_options = Options()
firefox_options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"
firefox_options.add_argument("--headless")

# Read login credentials from CSV file
def get_login_credentials(csv_file):
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        return list(reader)  # Return all rows as a list of dictionaries

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

try:
    # Step 1: Load credentials
    print("1. Loading credentials from CSV...")
    credentials = get_login_credentials("login_credentials.csv")

    # Step 2: Iterate over credentials
    for index, cred in enumerate(credentials, start=1):
        username = cred['username']
        password = cred['password']
        print(f"\nTest Case {index}:")
        print(f"   Username: {username}, Password: {password}")

        # Step 3: Open the login page
        print("   Opening the login page...")
        driver.get("http://localhost:3000/login")

        # Step 4: Fill in the username field
        print("   Filling in the username field...")
        username_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        username_input.clear()
        username_input.send_keys(username)

        # Step 5: Fill in the password field
        print("   Filling in the password field...")
        password_input = driver.find_element(By.ID, "password")
        password_input.clear()
        password_input.send_keys(password)

        # Step 6: Submit the login form
        print("   Submitting the login form...")
        login_button = driver.find_element(By.XPATH, "//button[text()='Sign In']")
        login_button.click()

        # Step 7: Wait for the dashboard to load
        print("   Waiting for the dashboard to load...")
        try:
            WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
            print(f"   Login successful! Current URL: {driver.current_url}")

            # Step 8: Locate and click the logout button
            print("   Locating and clicking the 'Sign Out' button...")
            logout_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[text()='Sign Out']"))
            )
            logout_button.click()

            # Step 9: Verify redirected to login page
            WebDriverWait(driver, 10).until(EC.url_contains("login"))
            print(" ✔️ Logout successful")

        except Exception as e:
            print(f" ❌  Failed during login or logout")

finally:
    # Step 10: Close the browser
    print("\n ✔️ All tests completed. Closing the browser...")
    driver.quit()
