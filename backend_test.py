#!/usr/bin/env python3
"""
DataLab Georgia Backend API Testing Suite
Tests all backend endpoints for the data recovery service website
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://localhost:8001/api"
TIMEOUT = 30

class BackendTester:
    def __init__(self):
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": [],
            "test_details": []
        }
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
    
    def log_test(self, test_name: str, passed: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.results["total_tests"] += 1
        if passed:
            self.results["passed"] += 1
            status = "✅ PASS"
        else:
            self.results["failed"] += 1
            status = "❌ FAIL"
            self.results["errors"].append(f"{test_name}: {details}")
        
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")
        
        self.results["test_details"].append({
            "test": test_name,
            "passed": passed,
            "details": details,
            "response_data": response_data
        })
    
    def test_health_endpoints(self):
        """Test health and status endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "status" in data:
                    self.log_test("Root endpoint", True, f"Status: {data.get('status')}")
                else:
                    self.log_test("Root endpoint", False, "Missing required fields in response")
            else:
                self.log_test("Root endpoint", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Root endpoint", False, f"Exception: {str(e)}")
        
        # Test health endpoint
        try:
            response = self.session.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy" and data.get("database") == "connected":
                    self.log_test("Health endpoint", True, "Database connected")
                else:
                    self.log_test("Health endpoint", False, f"Unhealthy status: {data}")
            else:
                self.log_test("Health endpoint", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Health endpoint", False, f"Exception: {str(e)}")
    
    def test_contact_form_api(self):
        """Test Contact Form API endpoints"""
        print("\n=== Testing Contact Form API ===")
        
        # Test valid contact form submission
        valid_contact_data = {
            "name": "ნინო გელაშვილი",
            "email": "nino.gelashvili@example.com",
            "phone": "+995555123456",
            "subject": "მონაცემების აღდგენის შესახებ კითხვა",
            "message": "გამარჯობა, მინდა ვიცოდე თქვენი სერვისების შესახებ დეტალები. ჩემი ლეპტოპის მყარი დისკი დაზიანდა."
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/contact/", json=valid_contact_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "id" in data:
                    self.log_test("Contact form - valid data", True, f"Message ID: {data.get('id')}")
                else:
                    self.log_test("Contact form - valid data", False, f"Invalid response format: {data}")
            else:
                self.log_test("Contact form - valid data", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Contact form - valid data", False, f"Exception: {str(e)}")
        
        # Test invalid contact form - missing required fields
        invalid_contact_data = {
            "name": "ა",  # Too short
            "email": "invalid-email",  # Invalid format
            "subject": "მოკლე",  # Too short
            "message": "მოკლე"  # Too short
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/contact/", json=invalid_contact_data)
            if response.status_code == 422:  # Validation error
                self.log_test("Contact form - invalid data", True, "Validation errors caught correctly")
            else:
                self.log_test("Contact form - invalid data", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Contact form - invalid data", False, f"Exception: {str(e)}")
        
        # Test empty contact form
        try:
            response = self.session.post(f"{BASE_URL}/contact/", json={})
            if response.status_code == 422:
                self.log_test("Contact form - empty data", True, "Empty form rejected correctly")
            else:
                self.log_test("Contact form - empty data", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Contact form - empty data", False, f"Exception: {str(e)}")
    
    def test_service_request_api(self):
        """Test Service Request API endpoints"""
        print("\n=== Testing Service Request API ===")
        
        # Test valid service request creation
        valid_service_data = {
            "name": "გიორგი მამაცაშვილი",
            "email": "giorgi.mamacashvili@example.com",
            "phone": "+995555987654",
            "device_type": "hdd",
            "problem_description": "ჩემი კომპიუტერის მყარი დისკი აღარ მუშაობს. ძალიან მნიშვნელოვანი ფაილები მაქვს შენახული და მინდა მათი აღდგენა.",
            "urgency": "high"
        }
        
        case_id = None
        request_id = None
        try:
            response = self.session.post(f"{BASE_URL}/service-requests/", json=valid_service_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "case_id" in data:
                    case_id = data.get("case_id")
                    self.log_test("Service request - valid data", True, f"Case ID: {case_id}")
                else:
                    self.log_test("Service request - valid data", False, f"Invalid response format: {data}")
            else:
                self.log_test("Service request - valid data", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Service request - valid data", False, f"Exception: {str(e)}")
        
        # Test invalid service request - invalid device type
        invalid_service_data = {
            "name": "ტ",  # Too short
            "email": "invalid-email",
            "phone": "123",  # Too short
            "device_type": "invalid_device",  # Invalid enum
            "problem_description": "მოკლე",  # Too short
            "urgency": "invalid_urgency"  # Invalid enum
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/service-requests/", json=invalid_service_data)
            if response.status_code == 422:
                self.log_test("Service request - invalid data", True, "Validation errors caught correctly")
            else:
                self.log_test("Service request - invalid data", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Service request - invalid data", False, f"Exception: {str(e)}")
        
        # Test case tracking with valid case ID (if we got one)
        if case_id:
            try:
                response = self.session.get(f"{BASE_URL}/service-requests/{case_id}")
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["case_id", "device_type", "status", "progress", "created_at"]
                    if all(field in data for field in required_fields):
                        # Verify initial status is 'unread'
                        if data.get('status') == 'unread':
                            self.log_test("Case tracking - initial status", True, f"Status: {data.get('status')}, Progress: {data.get('progress')}%")
                        else:
                            self.log_test("Case tracking - initial status", False, f"Expected 'unread', got '{data.get('status')}'")
                    else:
                        self.log_test("Case tracking - valid case ID", False, f"Missing required fields: {data}")
                else:
                    self.log_test("Case tracking - valid case ID", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Case tracking - valid case ID", False, f"Exception: {str(e)}")
        
        # Test case tracking with invalid case ID
        try:
            response = self.session.get(f"{BASE_URL}/service-requests/INVALID123")
            if response.status_code == 404:
                self.log_test("Case tracking - invalid case ID", True, "Invalid case ID rejected correctly")
            else:
                self.log_test("Case tracking - invalid case ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Case tracking - invalid case ID", False, f"Exception: {str(e)}")
        
        # Store case_id and request_id for admin panel tests
        if case_id:
            self.test_case_id = case_id
            # Get request_id by fetching all requests
            try:
                response = self.session.get(f"{BASE_URL}/service-requests/")
                if response.status_code == 200:
                    requests = response.json()
                    for req in requests:
                        if req.get('case_id') == case_id:
                            self.test_request_id = req.get('id')
                            break
            except:
                pass
    
    def test_price_estimation_api(self):
        """Test Price Estimation API endpoints"""
        print("\n=== Testing Price Estimation API ===")
        
        # Test valid price estimation requests for different scenarios
        test_scenarios = [
            {
                "name": "HDD Logical Standard",
                "data": {"device_type": "hdd", "problem_type": "logical", "urgency": "standard"},
                "expected_price": 100  # 100 * 1.0 * 1.0
            },
            {
                "name": "SSD Physical Urgent", 
                "data": {"device_type": "ssd", "problem_type": "physical", "urgency": "urgent"},
                "expected_price": 338  # 150 * 1.5 * 1.5 = 337.5, rounded to 338
            },
            {
                "name": "RAID Water Emergency",
                "data": {"device_type": "raid", "problem_type": "water", "urgency": "emergency"},
                "expected_price": 1200  # 300 * 2.0 * 2.0
            },
            {
                "name": "USB Fire Emergency",
                "data": {"device_type": "usb", "problem_type": "fire", "urgency": "emergency"},
                "expected_price": 400  # 80 * 2.5 * 2.0
            }
        ]
        
        for scenario in test_scenarios:
            try:
                response = self.session.post(f"{BASE_URL}/price-estimate/", json=scenario["data"])
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["device_type", "problem_type", "urgency", "estimated_price", "timeframe_ka", "timeframe_en"]
                    if all(field in data for field in required_fields):
                        actual_price = data.get("estimated_price")
                        if actual_price == scenario["expected_price"]:
                            self.log_test(f"Price estimation - {scenario['name']}", True, f"Price: {actual_price}₾")
                        else:
                            self.log_test(f"Price estimation - {scenario['name']}", False, f"Expected {scenario['expected_price']}₾, got {actual_price}₾")
                    else:
                        self.log_test(f"Price estimation - {scenario['name']}", False, f"Missing required fields: {data}")
                else:
                    self.log_test(f"Price estimation - {scenario['name']}", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test(f"Price estimation - {scenario['name']}", False, f"Exception: {str(e)}")
        
        # Test invalid price estimation - invalid device type
        invalid_price_data = {
            "device_type": "invalid_device",
            "problem_type": "logical",
            "urgency": "standard"
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/price-estimate/", json=invalid_price_data)
            if response.status_code == 422:
                self.log_test("Price estimation - invalid device type", True, "Invalid device type rejected correctly")
            else:
                self.log_test("Price estimation - invalid device type", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Price estimation - invalid device type", False, f"Exception: {str(e)}")
        
        # Test pricing info endpoint
        try:
            response = self.session.get(f"{BASE_URL}/price-estimate/pricing-info")
            if response.status_code == 200:
                data = response.json()
                required_keys = ["base_prices", "problem_multipliers", "urgency_multipliers", "timeframes"]
                if all(key in data for key in required_keys):
                    self.log_test("Price estimation - pricing info", True, "All pricing data available")
                else:
                    self.log_test("Price estimation - pricing info", False, f"Missing pricing data: {data}")
            else:
                self.log_test("Price estimation - pricing info", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Price estimation - pricing info", False, f"Exception: {str(e)}")
    
    def test_admin_panel_functionality(self):
        """Test Admin Panel API endpoints for service requests"""
        print("\n=== Testing Admin Panel Functionality ===")
        
        # Test getting all active service requests
        try:
            response = self.session.get(f"{BASE_URL}/service-requests/")
            if response.status_code == 200:
                requests = response.json()
                if isinstance(requests, list):
                    # Check that all returned requests are not archived
                    all_active = all(not req.get('is_archived', False) for req in requests)
                    if all_active:
                        self.log_test("Admin - get active requests", True, f"Found {len(requests)} active requests")
                    else:
                        self.log_test("Admin - get active requests", False, "Some archived requests returned")
                else:
                    self.log_test("Admin - get active requests", False, "Response is not a list")
            else:
                self.log_test("Admin - get active requests", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - get active requests", False, f"Exception: {str(e)}")
        
        # Test status transitions and automatic timestamp updates
        if hasattr(self, 'test_request_id') and self.test_request_id:
            request_id = self.test_request_id
            
            # Test updating status to 'pending'
            try:
                update_data = {"status": "pending"}
                response = self.session.put(f"{BASE_URL}/service-requests/{request_id}", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Admin - update to pending", True, "Status updated successfully")
                        
                        # Verify the update by checking case tracking
                        if hasattr(self, 'test_case_id'):
                            track_response = self.session.get(f"{BASE_URL}/service-requests/{self.test_case_id}")
                            if track_response.status_code == 200:
                                track_data = track_response.json()
                                if track_data.get('status') == 'pending':
                                    self.log_test("Admin - verify pending status", True, "Status correctly updated to pending")
                                else:
                                    self.log_test("Admin - verify pending status", False, f"Expected 'pending', got '{track_data.get('status')}'")
                    else:
                        self.log_test("Admin - update to pending", False, f"Update failed: {data}")
                else:
                    self.log_test("Admin - update to pending", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - update to pending", False, f"Exception: {str(e)}")
            
            # Test updating status to 'in_progress' (should set started_at)
            try:
                update_data = {"status": "in_progress"}
                response = self.session.put(f"{BASE_URL}/service-requests/{request_id}", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Admin - update to in_progress", True, "Status updated to in_progress")
                        
                        # Verify started_at timestamp was set
                        if hasattr(self, 'test_case_id'):
                            track_response = self.session.get(f"{BASE_URL}/service-requests/{self.test_case_id}")
                            if track_response.status_code == 200:
                                track_data = track_response.json()
                                if track_data.get('started_at'):
                                    self.log_test("Admin - started_at timestamp", True, f"Started at: {track_data.get('started_at')}")
                                else:
                                    self.log_test("Admin - started_at timestamp", False, "started_at not set")
                    else:
                        self.log_test("Admin - update to in_progress", False, f"Update failed: {data}")
                else:
                    self.log_test("Admin - update to in_progress", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - update to in_progress", False, f"Exception: {str(e)}")
            
            # Test updating price
            try:
                update_data = {"price": 250.50}
                response = self.session.put(f"{BASE_URL}/service-requests/{request_id}", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Admin - update price", True, "Price updated successfully")
                        
                        # Verify price in case tracking
                        if hasattr(self, 'test_case_id'):
                            track_response = self.session.get(f"{BASE_URL}/service-requests/{self.test_case_id}")
                            if track_response.status_code == 200:
                                track_data = track_response.json()
                                if track_data.get('price') == 250.50:
                                    self.log_test("Admin - verify price", True, f"Price: {track_data.get('price')}₾")
                                else:
                                    self.log_test("Admin - verify price", False, f"Expected 250.50, got {track_data.get('price')}")
                    else:
                        self.log_test("Admin - update price", False, f"Update failed: {data}")
                else:
                    self.log_test("Admin - update price", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - update price", False, f"Exception: {str(e)}")
            
            # Test updating status to 'completed' (should set completed_at)
            try:
                update_data = {"status": "completed"}
                response = self.session.put(f"{BASE_URL}/service-requests/{request_id}", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Admin - update to completed", True, "Status updated to completed")
                        
                        # Verify completed_at timestamp was set
                        if hasattr(self, 'test_case_id'):
                            track_response = self.session.get(f"{BASE_URL}/service-requests/{self.test_case_id}")
                            if track_response.status_code == 200:
                                track_data = track_response.json()
                                if track_data.get('completed_at'):
                                    self.log_test("Admin - completed_at timestamp", True, f"Completed at: {track_data.get('completed_at')}")
                                else:
                                    self.log_test("Admin - completed_at timestamp", False, "completed_at not set")
                    else:
                        self.log_test("Admin - update to completed", False, f"Update failed: {data}")
                else:
                    self.log_test("Admin - update to completed", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - update to completed", False, f"Exception: {str(e)}")
            
            # Test archiving completed request
            try:
                response = self.session.put(f"{BASE_URL}/service-requests/{request_id}/archive")
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Admin - archive request", True, "Request archived successfully")
                    else:
                        self.log_test("Admin - archive request", False, f"Archive failed: {data}")
                else:
                    self.log_test("Admin - archive request", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - archive request", False, f"Exception: {str(e)}")
            
            # Test getting archived requests
            try:
                response = self.session.get(f"{BASE_URL}/service-requests/archived")
                if response.status_code == 200:
                    archived_requests = response.json()
                    if isinstance(archived_requests, list):
                        # Check if our archived request is in the list
                        found_archived = any(req.get('id') == request_id for req in archived_requests)
                        if found_archived:
                            self.log_test("Admin - get archived requests", True, f"Found {len(archived_requests)} archived requests")
                        else:
                            self.log_test("Admin - get archived requests", False, "Archived request not found in archived list")
                    else:
                        self.log_test("Admin - get archived requests", False, "Response is not a list")
                else:
                    self.log_test("Admin - get archived requests", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Admin - get archived requests", False, f"Exception: {str(e)}")
        
        # Test archiving non-completed request (should fail)
        try:
            # Create a new request for this test
            test_data = {
                "name": "ანა ხუციშვილი",
                "email": "ana.khutsishvili@example.com", 
                "phone": "+995555111222",
                "device_type": "ssd",
                "problem_description": "SSD დისკი დაზიანდა და მონაცემები დაიკარგა",
                "urgency": "medium"
            }
            
            create_response = self.session.post(f"{BASE_URL}/service-requests/", json=test_data)
            if create_response.status_code == 200:
                # Get the request ID
                all_requests = self.session.get(f"{BASE_URL}/service-requests/")
                if all_requests.status_code == 200:
                    requests = all_requests.json()
                    new_request = next((req for req in requests if req.get('email') == test_data['email']), None)
                    if new_request:
                        new_request_id = new_request.get('id')
                        
                        # Try to archive without completing
                        archive_response = self.session.put(f"{BASE_URL}/service-requests/{new_request_id}/archive")
                        if archive_response.status_code == 400:
                            self.log_test("Admin - archive non-completed", True, "Correctly rejected archiving non-completed request")
                        else:
                            self.log_test("Admin - archive non-completed", False, f"Expected 400, got {archive_response.status_code}")
        except Exception as e:
            self.log_test("Admin - archive non-completed", False, f"Exception: {str(e)}")
    
    def test_contact_admin_functionality(self):
        """Test Contact Message Admin functionality"""
        print("\n=== Testing Contact Admin Functionality ===")
        
        # Create a test contact message first
        contact_data = {
            "name": "მარიამ ვაშაკიძე",
            "email": "mariam.vashakidze@example.com",
            "phone": "+995555333444",
            "subject": "ტექნიკური მხარდაჭერის შესახებ",
            "message": "გამარჯობა, მინდა ვიცოდე თქვენი სერვისების შესახებ დეტალური ინფორმაცია და ფასები."
        }
        
        message_id = None
        try:
            response = self.session.post(f"{BASE_URL}/contact/", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                message_id = data.get('id')
                self.log_test("Contact admin - create message", True, f"Message ID: {message_id}")
            else:
                self.log_test("Contact admin - create message", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Contact admin - create message", False, f"Exception: {str(e)}")
        
        # Test getting all contact messages
        try:
            response = self.session.get(f"{BASE_URL}/contact/")
            if response.status_code == 200:
                messages = response.json()
                if isinstance(messages, list) and len(messages) > 0:
                    self.log_test("Contact admin - get all messages", True, f"Found {len(messages)} messages")
                else:
                    self.log_test("Contact admin - get all messages", False, "No messages found or invalid format")
            else:
                self.log_test("Contact admin - get all messages", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Contact admin - get all messages", False, f"Exception: {str(e)}")
        
        # Test updating message status
        if message_id:
            try:
                update_data = {"status": "read"}
                response = self.session.put(f"{BASE_URL}/contact/{message_id}/status", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test("Contact admin - update status", True, "Status updated to read")
                    else:
                        self.log_test("Contact admin - update status", False, f"Update failed: {data}")
                else:
                    self.log_test("Contact admin - update status", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test("Contact admin - update status", False, f"Exception: {str(e)}")
        
        # Test contact statistics
        try:
            response = self.session.get(f"{BASE_URL}/contact/stats")
            if response.status_code == 200:
                stats = response.json()
                required_fields = ["total", "new", "read", "replied"]
                if all(field in stats for field in required_fields):
                    self.log_test("Contact admin - statistics", True, f"Total: {stats['total']}, New: {stats['new']}, Read: {stats['read']}")
                else:
                    self.log_test("Contact admin - statistics", False, f"Missing fields in stats: {stats}")
            else:
                self.log_test("Contact admin - statistics", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Contact admin - statistics", False, f"Exception: {str(e)}")
    
    def test_performance_and_response_times(self):
        """Test API performance and response times"""
        print("\n=== Testing Performance ===")
        
        endpoints_to_test = [
            ("Health Check", f"{BASE_URL}/health"),
            ("Pricing Info", f"{BASE_URL}/price-estimate/pricing-info"),
            ("Root", f"{BASE_URL}/")
        ]
        
        for name, url in endpoints_to_test:
            try:
                start_time = time.time()
                response = self.session.get(url)
                end_time = time.time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 5000:  # Less than 5 seconds
                    self.log_test(f"Performance - {name}", True, f"Response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance - {name}", False, f"Status: {response.status_code}, Time: {response_time:.2f}ms")
            except Exception as e:
                self.log_test(f"Performance - {name}", False, f"Exception: {str(e)}")
    
        """Test API performance and response times"""
        print("\n=== Testing Performance ===")
        
        endpoints_to_test = [
            ("Health Check", f"{BASE_URL}/health"),
            ("Pricing Info", f"{BASE_URL}/price-estimate/pricing-info"),
            ("Root", f"{BASE_URL}/")
        ]
        
        for name, url in endpoints_to_test:
            try:
                start_time = time.time()
                response = self.session.get(url)
                end_time = time.time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 5000:  # Less than 5 seconds
                    self.log_test(f"Performance - {name}", True, f"Response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance - {name}", False, f"Status: {response.status_code}, Time: {response_time:.2f}ms")
            except Exception as e:
                self.log_test(f"Performance - {name}", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting DataLab Georgia Backend API Tests")
        print(f"📍 Testing against: {BASE_URL}")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Initialize test tracking variables
        self.test_case_id = None
        self.test_request_id = None
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_contact_form_api()
        self.test_service_request_api()
        self.test_admin_panel_functionality()
        self.test_contact_admin_functionality()
        self.test_price_estimation_api()
        self.test_performance_and_response_times()
        
        # Print summary
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"Success Rate: {(self.results['passed']/self.results['total_tests']*100):.1f}%")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  • {error}")
        
        print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return self.results

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results['failed'] > 0:
        exit(1)
    else:
        print("\n🎉 All tests passed!")
        exit(0)