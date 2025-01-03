# Check redirection of every 'Syllabus' button

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
firefox_options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"
#firefox_options.add_argument("--headless")

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

def select_option():
    """Selects the option '2022-2026' from the dropdown with ID 'options'."""
    print("Selecting the option '2022-2026'...")
    dropdown = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "options"))
    )
    select = Select(dropdown)
    select.select_by_visible_text("2022-2026")
    print("Option '2022-2026' selected successfully.")

try:
    # Step 1: Log in to the website
    log_in("superadmin@email.com", "superadminpass")  

    toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
    toggle_button.click()

    select_option()

    # Step 2: Find all "Syllabus" buttons on the page
    syllabus_buttons = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[text()='Syllabus']"))
    )
    print(f"Found {len(syllabus_buttons)} 'Syllabus' buttons.")

    # Step 3: Click on each "Syllabus" button and check the URL redirection
    for index in range(10):
        print(f"\nTesting 'Syllabus' button {index + 1}...")

        # Re-locate buttons to avoid stale references
        syllabus_buttons = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//button[text()='Syllabus']"))
        )
        button = syllabus_buttons[index]  # Current button

        # Ensure button is clickable
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable(button))
        button.click()

        # Wait for redirection and verify URL
        WebDriverWait(driver, 10).until(EC.url_contains("/courses/"))
        print(f"Redirected successfully to: {driver.current_url}")
        time.sleep(2)

        # Go back to the main page
        driver.execute_script("window.history.back()")
        WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
        toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
        toggle_button.click()

        select_option()

        time.sleep(2)

    print("\n ✔️ All 'Syllabus' buttons tested successfully.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Step 4: Close the browser
    print("Closing the browser...")
    driver.quit()
