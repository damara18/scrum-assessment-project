class InvalidCredentialsException(Exception):

    def __init__(self, detail: str = "Invalid credentials"):
        self.detail = detail


class DataNotFoundException(Exception):
    def __init__(self, entity_name: str, detail: str = "Data not found"):
        self.entity_name = entity_name
        self.detail = detail
