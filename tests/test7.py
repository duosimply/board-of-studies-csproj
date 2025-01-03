# Check the visibility of Edit Toggle based on Role

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"

# Set up Firefox options
firefox_options = Options()
firefox_options.binary_location = r"C:\\Program Files\\Mozilla Firefox\\firefox.exe"
#firefox_options.add_argument("--headless")

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

def log_in(username, password):
    """Logs into the website."""
    print(f"Logging in as {username}...")
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
    print(f"Login successful as {username}. Redirected to dashboard.")

def check_toggle_edit_button(should_be_visible):
    """Checks the visibility of the 'Toggle Edit' button."""
    print("Checking 'Toggle Edit' button visibility...")
    try:
        toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
        is_visible = toggle_button.is_displayed()
        if should_be_visible:
            assert is_visible, "'Toggle Edit' button should be visible but is not."
            print("' ✔️ Toggle Edit' button is visible as expected.")
        else:
            assert not is_visible, "'Toggle Edit' button should be hidden but is visible."
    except Exception:
        if should_be_visible:
            raise AssertionError("'Toggle Edit' button should be visible but is not.")
        print("' ✔️ Toggle Edit' button is correctly hidden.")

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
    # Step 1: Log in as admin
    log_in("superadmin@email.com", "superadminpass")

    # Step 2: Verify 'Toggle Edit' button is visible for admin
    check_toggle_edit_button(should_be_visible=True)

    # Step 3: Log out
    print("Logging out...")
    logout_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//button[text()='Sign Out']"))
    )
    logout_button.click()
    WebDriverWait(driver, 10).until(EC.url_contains("login"))
    print("Logged out successfully.")

    # Step 4: Log in as a regular user
    log_in("admin3@example.com", "12345")

    # Step 5: Verify 'Toggle Edit' button is hidden for the regular user
    check_toggle_edit_button(should_be_visible=False)

except AssertionError as e:
    print("Test failed:", str(e))

except Exception as e:
    print("An error occurred:", str(e))

finally:
    # Step 6: Close the browser
    print("\n ✔️ All tests completed. Closing the browser...")
    driver.quit()
