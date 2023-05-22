# pos

### migrations

```bash
cd src
# new manifest
dotnet new tool-manifest

# restore dotnet tool, run once only
dotnet tool restore

# check database
dotnet ef dbcontext info -s src/megax/MegaApp

# apply migrations
dotnet ef database update -s src/megax/MegaApp

# add new migration
dotnet ef migrations add Init -s src/megax/MegaApp/ -p src/megax/MegaApp.Core/

# generate a migration script
dotnet ef migrations script -s src/megax/MegaApp/ -p src/megax/MegaApp.Core/ -o src/megax/MegaApp.Core/Migrations/sql/1-init.sql
```
