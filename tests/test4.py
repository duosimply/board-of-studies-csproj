# Check that the minimum value is 1 and maximum value is 8 for "Move"
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import csv

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"

# Set up Firefox options
firefox_options = Options()
firefox_options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"
firefox_options.add_argument("--headless")

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

def log_in(username, password):
    """Logs into the website."""
    print("Logging in...")
    driver.get("http://localhost:3000/login")  
    
    # Wait for the login fields to load
    username_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    password_input = driver.find_element(By.ID, "password")
    
    # Enter login credentials
    username_input.clear()
    username_input.send_keys(username)
    password_input.clear()
    password_input.send_keys(password)
    
    # Submit the login form
    login_button = driver.find_element(By.XPATH, "//button[text()='Sign In']")
    login_button.click()

    # Wait for the dashboard to load
    WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
    print(" ✔️ Login successful. Redirected to dashboard.")

def select_option():
    """Selects the option '2022-2026' from the dropdown with ID 'options'."""
    print("Selecting the option '2022-2026'...")
    dropdown = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "options"))
    )
    select = Select(dropdown)
    select.select_by_visible_text("2022-2026")
    print(" ✔️ Option '2022-2026' selected successfully.")

try:
    # Step 1: Log in to the website
    log_in("superadmin@email.com", "superadminpass")  

    # Step 2: Navigate to the components page
    print("Navigating to the dashboard page...")
    driver.get("http://localhost:3000/dashboard")  

    toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
    toggle_button.click()

    select_option()

    # Step 3: Wait for the elements to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.ID, "moveNum"))
    )

    # Step 4: Find all inputs with ID "moveNum"
    move_num_elements = driver.find_elements(By.ID, "moveNum")
    print(f"Found {len(move_num_elements)} instances of 'moveNum'.")

    # Step 5: Test each instance
    for index, element in enumerate(move_num_elements, start=1):
        print(f"\nTesting instance {index}...")
        
        # Get the max and min attribute values
        max_value = element.get_attribute("max")
        min_value = element.get_attribute("min")

        # Check if max and min attributes meet the criteria
        assert max_value == "8", f"Instance {index}: Max value is {max_value}, expected 8."
        assert min_value == "1", f"Instance {index}: Min value is {min_value}, expected 1."
        
        print(f" ✔️  Instance {index}: Passed. Max = {max_value}, Min = {min_value}.")

except AssertionError as e:
    print("Test failed:", str(e))

except Exception as e:
    print("An error occurred:", str(e))

finally:
    # Step 6: Close the browser
    print("\n ✔️ All tests completed. Closing the browser...")
    driver.quit()
