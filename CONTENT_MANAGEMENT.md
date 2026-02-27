# Content Management Guide

## Rule: Raw Files Are Source of Truth

### Overview
All content is managed through **raw files** (`*.raw.md`). These files are maintained by the team and contain the authoritative content for the website.

### File Structure

Each content folder contains three types of files:
- `*.raw.md` - **Team maintained source file** (can be English, Chinese, or mixed)
- `*.en.md` - English version (auto-synced from raw)
- `*.zh.md` - Chinese version (auto-synced from raw)

### Content Rule

**✅ RAW FILE IS THE SOURCE OF TRUTH**

1. **Team maintains only `*.raw.md` files**
2. **The raw file can contain**:
   - English content
   - Chinese content
   - Mixed English/Chinese content

3. **Auto-sync process**:
   - `*.en.md` files are automatically copied from `*.raw.md`
   - `*.zh.md` files are automatically copied from `*.raw.md`
   - Both `.en.md` and `.zh.md` have **identical content** to the raw file

### Example

If `overview.raw.md` contains:
```markdown
# Intelligent Research System
**案例编号**: Case251120Y01
This is a research system for AI.
```

Then both `overview.en.md` and `overview.zh.md` will have the **exact same content**:
```markdown
# Intelligent Research System
**案例编号**: Case251120Y01
This is a research system for AI.
```

The website will display this content exactly as written in the raw file.

### Benefits

- **Single source of truth**: Team only needs to maintain one file per section
- **Consistency**: `.en.md` and `.zh.md` always match the raw file
- **Flexibility**: Supports English, Chinese, or mixed content without any processing
- **No content loss**: All formatting, Chinese characters, and structure preserved exactly

### Workflow

1. Content team updates `*.raw.md` file
2. Run sync script to copy to `.en.md` and `.zh.md`
3. Commit all three files to repository
4. Website displays content from locale-specific files

### Sync Command

To sync all content files at once:

```bash
cd Content
find . -name "*.raw.md" -type f -exec sh -c '
  base="${1%.raw.md}"
  cp "$1" "$base.en.md" 2>/dev/null
  cp "$1" "$base.zh.md" 2>/dev/null
  echo "Synced: $1"
' {} \;
```

To sync a specific folder:

```bash
cd Content/Homepage
for f in *.raw.md; do
  base="${f%.raw.md}"
  cp "$f" "$base.en.md"
  cp "$f" "$base.zh.md"
done
```

### Important Notes

- **Never manually edit** `.en.md` or `.zh.md` files - they will be overwritten
- **Always edit** the `*.raw.md` file
- **Mixed content is supported** - the raw file can contain both English and Chinese
- **No translation needed** - the raw file content is used as-is for both locales

### Content Folders Structure

```
Content/
├── About/
│   ├── page.raw.md (team maintains this)
│   ├── page.en.md (auto-synced)
│   └── page.zh.md (auto-synced)
├── Arena/
│   ├── page.raw.md (team maintains this)
│   ├── page.en.md (auto-synced)
│   └── page.zh.md (auto-synced)
└── Arena/
    └── intelligent-research-system-v1/
        ├── overview.raw.md (team maintains this)
        ├── overview.en.md (auto-synced)
        ├── overview.zh.md (auto-synced)
        ├── implementation.raw.md (team maintains this)
        ├── implementation.en.md (auto-synced)
        ├── implementation.zh.md (auto-synced)
        ├── requirements.raw.md (team maintains this)
        ├── requirements.en.md (auto-synced)
        ├── requirements.zh.md (auto-synced)
        ├── validation-report.raw.md (team maintains this)
        ├── validation-report.en.md (auto-synced)
        ├── validation-report.zh.md (auto-synced)
        ├── project-report.raw.md (team maintains this)
        ├── project-report.en.md (auto-synced)
        └── project-report.zh.md (auto-synced)
├── FAQ/
│   ├── page.raw.md (team maintains this)
│   ├── page.en.md (auto-synced)
│   └── page.zh.md (auto-synced)
├── Framework/
│   ├── page.raw.md (team maintains this)
│   ├── page.en.md (auto-synced)
    └── page.zh.md (auto-synced)
└── Homepage/
    ├── hero.raw.md (team maintains this)
    ├── hero.en.md (auto-synced)
    └── hero.zh.md (auto-synced)
    ├── approach.raw.md (team maintains this)
    ├── approach.en.md (auto-synced)
    └── approach.zh.md (auto-synced)
```

### Verification

To verify files are synced correctly:

```bash
# Check if files match
diff Content/Homepage/hero.raw.md Content/Homepage/hero.en.md
diff Content/Homepage/hero.raw.md Content/Homepage/hero.zh.md

# Should show no output if files are identical
```

---

**Last Updated**: 2025-01-29
**Version**: 2.0
**Status**: ✅ All content synced across website
