```sql
SELECT 
    JSON_AGG(
        REPLACE(handle, 'lens/', '')
    ) AS handles
FROM (
    SELECT handle
    FROM app.onboarding_handle
    WHERE onboarded_by_address = '0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53'
    ORDER BY handle_id
    LIMIT <quantity> OFFSET <last_offset>
) subquery;
```

## Invoices

| For     | Month | Year | Quantity | Amount  | Total   | Offset              | Filter                  |
|---------|-------|------|----------|---------|---------|---------------------|-------------------------|
| SAGAR   | 11    | 2024 | 3948     | 190     | 750000  | 9028 + 8158 = 17186 | LIMIT 3948 OFFSET 17186 |
| YOGINTH | 11    | 2024 | 8158     | 190     | 1550000 | 6168 + 2860 = 9028  | LIMIT 8158 OFFSET 9028  |
| SAGAR   | 10    | 2024 | 2860     | 250     | 715000  | 6167 + 1 = 6168     | LIMIT 2860 OFFSET 6168  |
| YOGINTH | 10    | 2024 | 1        | 1120000 | 1120000 | 5567 + 600 = 6167   | LIMIT 1 OFFSET 6167     |
| SAGAR   | 9     | 2024 | 600      | 250     | 150000  | 5566 + 1 = 5567     | LIMIT 600 OFFSET 5567   |
| YOGINTH | 9     | 2024 | 1        | 650000  | 650000  | 2396 + 3170 = 5566  | LIMIT 1 OFFSET 5566     |
| SAGAR   | 8     | 2024 | 3170     | 284     | 900280  | 2395 + 1 = 2396     | LIMIT 3170 OFFSET 2396  |
| YOGINTH | 8     | 2024 | 1        | 1900000 | 1900000 | 1880 + 515 = 2395   | LIMIT 1 OFFSET 2395     |
| SAGAR   | 7     | 2024 | 515      | 1865    | 960475  | 1879 + 1 = 1880     | LIMIT 515 OFFSET 1880   |
| YOGINTH | 7     | 2024 | 1        | 1181420 | 1181420 | 1399 + 480 = 1879   | LIMIT 1 OFFSET 1879     |
| SAGAR   | 6     | 2024 | 480      | 560     | 268800  | 249 + 1150 = 1399   | LIMIT 480 OFFSET 1399   |
| YOGINTH | 6     | 2024 | 1150     | 560     | 644000  | 0 + 249 = 249       | LIMIT 1150 OFFSET 249   |
| YOGINTH | 5     | 2024 | 249      | 640     | 159360  | 0 + 0 = 0           | LIMIT 249 OFFSET 0      |
