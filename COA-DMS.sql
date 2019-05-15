CREATE DATABASE "JEVrecord";
USE "JEVrecord";


DROP TABLE IF EXISTS "JEV_Record";
CREATE TABLE "JEV_Record" (
  "JEV Number" LONGTEXT NOT NULL,
  "Check Number" LONGTEXT,
  "Amount" DECIMAL(19, 4) DEFAULT 0,
  "Status" LONGTEXT,
  "Voucher Number" LONGTEXT,
  "Date of Voucher" DATE,
  "Payee" LONGTEXT,
  "Source of Fund" VARCHAR(255),
  "Type of Transaction" LONGTEXT,
  "Submitted Documents" LONGTEXT,
  "Unsubmitted Documents" LONGTEXT,
)

INSERT INTO
  "JEV_Record" (
    "JEV Number",
    "Check Number",
    "Amount",
    "Status",
    "Voucher Number",
    "Date of Voucher",
    "Payee",
    "Source of Fund",
    "Type of Transaction",
    "Submitted Documents",
    "Unsubmitted Documents"
  )
VALUES
  (
    "100-200-300-1",
    "12345",
    NULL,
    "Submitted",
    "100-200-300",
    "2015-12-03",
    "gxxllan",
    "general fund",
    NULL,
    NULL,
    NULL
  );