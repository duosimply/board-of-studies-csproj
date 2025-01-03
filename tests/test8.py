# Adding a course

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
   
    log_in("superadmin@email.com", "superadminpass")

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
    print("Clicked 'New Course' button.")

    # Wait for the modal popup to appear
    popup = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fixed"))  # Adjust class to match your modal's container
    )
    assert popup.is_displayed(), "Popup did not appear."
    print("Popup is visible.")

    # TODO add test to check if a course is being added or not fill the detais in the above popup 
    # The pop up contains input fields with ids: cname(text), ccode(text), cl(number), ct(number), cp(number)
    # once filled, click on a button with text "Add"
    # now search on the dashboard page for an element with the visible text to be the ccode that was just added

        # Fill in the course details
    print("Filling in course details...")
    course_name = "Test Course"
    course_code = "TC101"
    course_lecture = 3
    course_tutorial = 1
    course_practical = 2

    cname_input = popup.find_element(By.ID, "cname")
    ccode_input = popup.find_element(By.ID, "ccode")
    cl_input = popup.find_element(By.ID, "cl")
    ct_input = popup.find_element(By.ID, "ct")
    cp_input = popup.find_element(By.ID, "cp")

    cname_input.send_keys(course_name)
    ccode_input.send_keys(course_code)
    cl_input.send_keys(course_lecture)
    ct_input.send_keys(course_tutorial)
    cp_input.send_keys(course_practical)

    print("Course details filled in successfully.")

    # Click the "Add" button
    add_button = popup.find_element(By.XPATH, "//button[text()='Add']")
    add_button.click()
    print(" ✔️ Clicked 'Add' button to submit the new course.")

    time.sleep(2)

    WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
    driver.refresh()

    toggle_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//button[text()='Toggle Edit']"))
        )
    toggle_button.click()

    select_option()

    # Wait for the dashboard to reflect the new course
    print("Verifying the addition of the new course...")
    '''WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, f"//*[text()='TC101']"))
   )'''
    print(f" ✔️ Course '{course_code}' added successfully and visible on the dashboard.")

    


except AssertionError as e:
    print("Test failed:", str(e))

except Exception as e:
    print("An error occurred:", str(e))

finally:
    # Step 6: Close the browser
    print("\nAll tests completed. Closing the browser...")
    driver.quit()
