# Testing that no other page is available before login

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Path to GeckoDriver executable
gecko_driver_path = "./geckodriver.exe"  

# Set up Firefox options 
# headless, runs without GUI
firefox_options = Options()
firefox_options.binary_location = r"C:\Program Files\Mozilla Firefox\firefox.exe"
firefox_options.add_argument("--headless")

# Initialize WebDriver
service = Service(executable_path=gecko_driver_path)
driver = webdriver.Firefox(service=service, options=firefox_options)

try:
    
    print("Trying to fetch the Dashboard page")
    print("Ideally it should not be rendered without login")
    driver.get("http://localhost:3000/dashboard")
    print("Page Title: ", driver.title)
    print(driver.current_url)
    WebDriverWait(driver, 10).until(EC.url_contains("login"))
    print("✔️ Fetched the Login page Successfully")
    print("\n")

    print("Trying to fetch the Profile page")
    print("Ideally it should not be rendered without login")
    driver.get("http://localhost:3000/profiles")
    print("Page Title: ", driver.title)
    print(driver.current_url)
    WebDriverWait(driver, 10).until(EC.url_contains("login"))
    print("✔️ Fetched the Login page Successfully")
    print("\n")

    print("Trying to fetch the a Course page")
    print("Ideally it should not be rendered without login")
    driver.get("http://localhost:3000/courses/18EMAB101")
    print("Page Title: ", driver.title)
    print(driver.current_url)
    WebDriverWait(driver, 10).until(EC.url_contains("login"))
    print("✔️ Fetched the Login page Successfully")
    print("\n")

    
except Exception as e:
    print("An error occurred")

finally:
    # Step 8: Close the browser
    driver.quit()
