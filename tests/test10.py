from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"

# Set up Firefox options
firefox_options = Options()
firefox_options.binary_location = r"C:\\Program Files\\Mozilla Firefox\\firefox.exe"
# firefox_options.add_argument("--headless")

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

def log_in(username, password):
    """Logs into the website."""
    print("Logging in...")
    driver.get("http://localhost:3000/login")  # Adjust to your login page URL
    
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
    print("Login successful. Redirected to dashboard.")

def add_batch_test():
    """Test the 'Add Batch' functionality by clicking on the image."""
    try:
        print("Navigating to the webpage...")
        driver.get("http://localhost:3000/dashboard")

        # Wait for the 'Add Batch' button to appear
        print("Locating 'Add Batch' button...")
        add_batch_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Add Batch']"))
        )
        print("'Add Batch' button found. Clicking it...")
        add_batch_button.click()

        # Wait for batch input and the image to appear
        print("Waiting for batch input field and image...")
        batch_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='number']"))
        )
        batch_image = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//img[@alt='batch input']"))
        )

        # Enter batch value and click the image
        batch_value = "2024"
        print(f" ✔️ Entering batch value: {batch_value}")
        batch_input.send_keys(batch_value)
        print("Clicking the image to submit the new batch...")
        batch_image.click()
        print(" ✔️ New Batch added")

        driver.refresh()

    except Exception as e:
        print("An error occurred:", str(e))

def check_toggle_button():
    """Checks and clicks the toggle edit button."""
    try:
        print("Locating the 'Toggle Edit' button...")
        toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
        print("'Toggle Edit' button found. Clicking it...")
        toggle_button.click()
    except Exception as e:
        print("An error occurred while locating the 'Toggle Edit' button:", str(e))

def run_tests():
    """Run the login and batch adding test."""
    log_in("superadmin@email.com", "superadminpass")
    check_toggle_button()
    add_batch_test()
    time.sleep(2)
    print("   Locating and clicking the 'Sign Out' button...")
    logout_button = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//button[text()='Sign Out']"))
    )
    logout_button.click()
    WebDriverWait(driver, 10).until(EC.url_contains("login"))
    log_in("superadmin@email.com", "superadminpass")
    check_toggle_button()
    print("Selecting the option '2024-2028'...")
    dropdown = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "options"))
    )
    select = Select(dropdown)
    select.select_by_visible_text("2024-2028")
    print(" ✔️ Option '2024-2028' selected successfully.")

# Run the function
run_tests()
