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
);

CREATE TABLE ccca.order (
	order_id UUID,
	market_id TEXT,
	account_id UUID,
	side TEXT,
	quantity NUMERIC,
	price NUMERIC,
	fill_quantity NUMERIC,
	fill_price NUMERIC,
	status TEXT,
	timestamp TIMESTAMPTZ,
	primary key (order_id)
);