DROP schema IF EXISTS ccca;
CREATE schema ccca;

CREATE TABLE ccca.account (
  account_id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  document TEXT,
  password TEXT
);

CREATE TABLE ccca.account_asset (
  account_id UUID,
  asset_id TEXT,
  quantity NUMERIC,
  PRIMARY KEY (account_id, asset_id)
)