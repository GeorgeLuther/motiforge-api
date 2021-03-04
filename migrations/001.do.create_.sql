CREATE TABLE _ (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);