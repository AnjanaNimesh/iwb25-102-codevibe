public type LoginRequest record {|
    string hospital_email;
    string password;
|};

public type Credentials record {|
    string hospital_email;
    string password_hash;
|};

// Data types for requests and responses
type UniversalLoginRequest record {
    string email;
    string password;
};

type AuthResult record {
    boolean isAuthenticated;
    string email;
    string role;
    string userId;
    string name;
};
