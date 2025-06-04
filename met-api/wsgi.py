from met_api import create_app

application = create_app()

if __name__ == "__main__":
    # Never set debug=True in production
    application.run(debug=False, host='0.0.0.0', port=5000)