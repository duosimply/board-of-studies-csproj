# Test for a correct Login and then redirection to the Profiles page on click

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
        for row in reader:
            return row['username'], row['password']  # Replace with your CSV column names

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

try:
    # Step 1: Read credentials
    print("1. Reading credentials from CSV...")
    username, password = get_login_credentials("login_credentials.csv")
    print(f"   Username: {username}, Password: {password}")

    # Step 2: Open the login page
    print("2. Opening the login page...")
    driver.get("http://localhost:3000/login")
    print(f"   Page Title: {driver.title}")

    # Step 3: Fill in the username field
    print("3. Filling in the username field...")
    username_input = driver.find_element(By.ID, "username")
    username_input.clear()
    username_input.send_keys(username)

    # Step 4: Fill in the password field
    print("4. Filling in the password field...")
    password_input = driver.find_element(By.ID, "password")
    password_input.clear()
    password_input.send_keys(password)

    # Step 5: Submit the login form
    print("5. Submitting the login form...")
    login_button = driver.find_element(By.XPATH, "//button[text()='Sign In']")
    login_button.click()

    # Step 6: Wait for the dashboard to load
    print("6. Waiting for the dashboard to load...")
    WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
    print(f"  ✔️ Login successful! Current URL: {driver.current_url}")

    # Step 7: Locate and click on the 'Profiles' link
    print("7. Locating and clicking on the 'Profiles' link...")
    profiles_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Profiles"))
    )
    profiles_link.click()

    # Step 8: Verify the Profiles page loaded
    print("8. Verifying the 'Profiles' page loaded...")
    WebDriverWait(driver, 10).until(EC.url_contains("profiles"))
    print(f" ✔️  Profiles page loaded successfully! Current URL: {driver.current_url}")

except Exception as e:
    print(f"An error occurred during testing: {str(e)}")

finally:
    # Step 9: Close the browser
    print("9. Closing the browser...")
    driver.quit()
