#!/bin/bash

# Source the helper functions
source "$(dirname "$0")/test-helpers.sh"

test_auth() {
    print_header "AUTHENTICATION TESTS"

    # Use admin email for testing to enable admin tests
    # Generate random email for testing
    RANDOM_NUM=$RANDOM
    USER_EMAIL="$ADMIN_EMAIL"
    USER_PASSWORD="Test@123456"
    USER_NAME="Test Admin User"

    # Test 1: Sign Up (or skip if user exists)
    print_test "POST /auth/signup - Create new user"
    response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/signup" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
        -d "{\"email\": \"$USER_EMAIL\", \"password\": \"$USER_PASSWORD\", \"name\": \"$USER_NAME\"}")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    USER_ALREADY_EXISTS=false
    if [ "$http_code" -eq "201" ]; then
        print_success "Sign up new user (Status: $http_code)"
        USER_ID=$(echo "$body" | grep -o '"id":[0-9]*' | cut -d':' -f2)
        print_info "Created user with ID: $USER_ID"
        echo "$body"
        ((PASSED_TESTS++))
        ((TOTAL_TESTS++))
    elif echo "$body" | grep -q "User already exists"; then
        print_info "Admin user already exists, skipping signup and email verification tests"
        USER_ALREADY_EXISTS=true
        ((TOTAL_TESTS++))
    else
        print_failure "Sign up new user (Expected: 201, Got: $http_code)" "$body"
        echo "$body"
        ((FAILED_TESTS++))
        ((TOTAL_TESTS++))
    fi

    if [ "$USER_ALREADY_EXISTS" = false ]; then
        sleep_with_message 2 "Waiting for verification email"

        # Test 2: Try login without verification (should fail)
        print_test "POST /auth/login - Login without email verification"
        api_post "/auth/login" "{
            \"email\": \"$USER_EMAIL\",
            \"password\": \"$USER_PASSWORD\"
        }" "Login without verification (should fail)" 403

        # Test 3: Verify email with code (manual step required)
        echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}MANUAL STEP REQUIRED:${NC}"
        echo -e "Check email: ${GREEN}${USER_EMAIL}${NC}"
        echo -e "Enter the 6-digit verification code:"
        read VERIFICATION_CODE
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

        print_test "POST /auth/verify-email - Verify email with code"
        response=$(api_post "/auth/verify-email" "{
            \"code\": \"$VERIFICATION_CODE\"
        }" "Verify email" 200)
    fi

    # Test 4: Login after verification (or just login if user already existed)
    print_test "POST /auth/login - Login with verified account"
    response=$(api_post "/auth/login" "{
        \"email\": \"$USER_EMAIL\",
        \"password\": \"$USER_PASSWORD\"
    }" "Login successfully" 200)

    # Token is automatically stored in cookie jar
    USER_ID=$(echo "$response" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    print_info "Login successful, cookie stored"

    # Test 5: Check authentication status
    print_test "GET /auth/check-auth - Check authentication status"
    api_get "/auth/check-auth" "Check auth status" 200

    # Test 6: Logout
    print_test "POST /auth/logout - Logout user"
    api_post "/auth/logout" "{}" "Logout" 200

    # Clear cookie jar
    rm -f "$COOKIE_JAR"
    print_info "Cookie cleared"

    # Test 7: Try to access protected route after logout
    print_test "GET /auth/check-auth - Check auth after logout (should fail)"
    api_get "/auth/check-auth" "Check auth after logout (should fail)" 401

    # Test 8: Login again to continue testing
    print_test "POST /auth/login - Login again for subsequent tests"
    response=$(api_post "/auth/login" "{
        \"email\": \"$USER_EMAIL\",
        \"password\": \"$USER_PASSWORD\"
    }" "Login again" 200)

    # Cookie is automatically stored in cookie jar
    print_info "Logged in again for subsequent tests"

    # Test 9: Forgot password
    print_test "POST /auth/forgot-password - Request password reset"
    api_post "/auth/forgot-password" "{
        \"email\": \"$USER_EMAIL\"
    }" "Request password reset" 200

    sleep_with_message 2 "Waiting for password reset email"

    # Test 10: Login with wrong password
    print_test "POST /auth/login - Login with wrong password (should fail)"
    api_post "/auth/login" "{
        \"email\": \"$USER_EMAIL\",
        \"password\": \"WrongPassword123\"
    }" "Login with wrong password (should fail)" 401

    # Test 11: Sign up with existing email
    print_test "POST /auth/signup - Sign up with existing email (should fail)"
    api_post "/auth/signup" "{
        \"email\": \"$USER_EMAIL\",
        \"password\": \"$USER_PASSWORD\",
        \"name\": \"Another User\"
    }" "Sign up with existing email (should fail)" 400

    print_info "Auth tests completed. User email: $USER_EMAIL"
}

# Export the function
export -f test_auth
