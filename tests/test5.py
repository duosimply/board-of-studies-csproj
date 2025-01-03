# test that background is disabled when clicked on new course

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"

# Set up Firefox options
firefox_options = Options()
firefox_options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"

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
    log_in("superadmin@email.com", "superadminpass")

    # Open the dashboard
    driver.get("http://localhost:3000/dashboard")

    toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
    toggle_button.click()

    select_option()

    # Locate and click the "New Course" button to open the modal
    new_course_image = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//img[@alt='plus']"))
    )
    new_course_image.click()
    print(" ✔️ Clicked 'New Course' button.")

    # Wait for the modal popup to appear
    popup = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fixed"))  # Adjust class to match your modal's container
    )
    assert popup.is_displayed(), "Popup did not appear."
    print(" ✔️ Popup is visible.")

    # Step 1: Verify scrolling is disabled
    overflow_property = driver.execute_script("return document.body.style.overflow;")
    assert overflow_property == "hidden", f"Expected body overflow to be 'hidden', but got '{overflow_property}'."
    print(" ✔️ Scrolling is disabled as expected.")

    # Close the popup
    close_button = popup.find_element(By.XPATH,"//button[text()='Close']")  # Adjust selector as needed
    close_button.click()
    print(" ✔️ Popup closed.")

    # Step 3: Verify scrolling is re-enabled
    WebDriverWait(driver, 10).until(lambda d: d.execute_script("return document.body.style.overflow;") == "auto")
    print(" ✔️ Scrolling is re-enabled after closing the popup.")

except AssertionError as e:
    print("Test failed:", str(e))

except TimeoutException as e:
    print("Timeout occurred:", str(e))

except Exception as e:
    print("An error occurred:", str(e))

finally:
    # Close the browser
    print("Closing the browser...")
    driver.quit()
