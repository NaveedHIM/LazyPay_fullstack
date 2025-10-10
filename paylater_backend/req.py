import requests

def test_customer_login():
    url = "http://127.0.0.1:8000/customer/login"
    payload = 'grant_type=password&username=naveed%40gmail.com&password=Naveed%402004&scope=&client_id=&client_secret='
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url, headers=headers, data=payload)
    assert response.status_code == 200