# iOS App Implementation Plan for LogMyDose

## Overview

Build a native iOS app for LogMyDose - a peptide therapy tracking platform. The backend API is already built; the iOS app will be built from scratch.

### Technical Choices
- **Swift 5.9+** with **SwiftUI**
- **iOS 17+** minimum target
- **MVVM** architecture pattern
- **Minimal dependencies** (native URLSession, Keychain, Core Data)

### MVP Features
1. Authentication (Login, Register, Token management)
2. Dashboard (Today's doses, adherence stats, quick actions)
3. Log Dose (Form with substance selection, injection site, notes)
4. Dose History (Paginated list with filtering)
5. View Protocols (Active protocols with schedule)

---

## Project Structure

```
/ios/LogMyDose/
├── LogMyDose.xcodeproj
├── LogMyDose/
│   ├── App/
│   │   ├── LogMyDoseApp.swift           # App entry point
│   │   └── ContentView.swift            # Root navigation container
│   │
│   ├── Core/
│   │   ├── Network/
│   │   │   ├── APIClient.swift          # URLSession HTTP client
│   │   │   ├── APIEndpoint.swift        # Endpoint definitions
│   │   │   ├── APIError.swift           # Error types
│   │   │   └── RequestBuilder.swift     # Request construction
│   │   │
│   │   ├── Auth/
│   │   │   ├── AuthManager.swift        # Token & session management
│   │   │   └── KeychainService.swift    # Secure token storage
│   │   │
│   │   └── Utilities/
│   │       ├── Constants.swift          # API base URL, config
│   │       └── Extensions/              # Swift extensions
│   │
│   ├── Models/
│   │   ├── Patient.swift
│   │   ├── Dose.swift
│   │   ├── Protocol.swift
│   │   ├── ProtocolSubstance.swift
│   │   ├── Substance.swift
│   │   └── DTOs/                        # API request/response DTOs
│   │
│   ├── Services/
│   │   ├── AuthService.swift
│   │   ├── DoseService.swift
│   │   ├── ProtocolService.swift
│   │   ├── SubstanceService.swift
│   │   └── PatientService.swift
│   │
│   ├── Features/
│   │   ├── Authentication/
│   │   │   ├── Views/ (LoginView, RegisterView)
│   │   │   └── ViewModels/ (AuthViewModel)
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Views/ (DashboardView, TodayDosesCard, etc.)
│   │   │   └── ViewModels/ (DashboardViewModel)
│   │   │
│   │   ├── LogDose/
│   │   │   ├── Views/ (LogDoseView, SubstancePicker, etc.)
│   │   │   └── ViewModels/ (LogDoseViewModel)
│   │   │
│   │   ├── DoseHistory/
│   │   │   ├── Views/ (DoseHistoryView, DoseFilterSheet)
│   │   │   └── ViewModels/ (DoseHistoryViewModel)
│   │   │
│   │   ├── Protocols/
│   │   │   ├── Views/ (ProtocolsListView, ProtocolDetailView)
│   │   │   └── ViewModels/ (ProtocolsListViewModel)
│   │   │
│   │   └── Profile/
│   │       ├── Views/ (ProfileView, SettingsView)
│   │       └── ViewModels/ (ProfileViewModel)
│   │
│   ├── Components/                      # Reusable UI components
│   │   ├── PrimaryButton.swift
│   │   ├── CardView.swift
│   │   ├── CustomTextField.swift
│   │   └── LoadingView.swift
│   │
│   ├── Navigation/
│   │   └── AppRouter.swift              # Tab bar + NavigationStack
│   │
│   └── Resources/
│       ├── Assets.xcassets
│       └── Info.plist
│
└── LogMyDoseTests/
```

---

## Implementation Phases

### Phase 1: Project Foundation
**Files to create:**
- `LogMyDoseApp.swift` - SwiftUI app entry with environment setup
- `ContentView.swift` - Root view with auth state handling
- `APIClient.swift` - Generic URLSession HTTP client with async/await
- `APIEndpoint.swift` - Enum for all API endpoints
- `APIError.swift` - Custom error types
- `KeychainService.swift` - Security framework wrapper
- `AuthManager.swift` - ObservableObject for auth state
- `Constants.swift` - API base URL configuration

### Phase 2: Data Models
**Files to create:**
- `Patient.swift` - Patient profile with Codable
- `Dose.swift` - Dose log model
- `Protocol.swift` - Treatment protocol model
- `ProtocolSubstance.swift` - Substance in protocol
- `Substance.swift` - Substance master data
- `DTOs/AuthDTOs.swift` - Login, register, token DTOs
- `DTOs/DoseDTOs.swift` - Log dose request/response
- `DTOs/PaginationDTO.swift` - Paginated response wrapper

### Phase 3: Core Services
**Files to create:**
- `AuthService.swift` - register, login, refresh, logout, me
- `DoseService.swift` - logDose, getTodayDoses, getDoses, getStats
- `ProtocolService.swift` - getTemplates, getProtocol, getSchedule
- `SubstanceService.swift` - getCategories, getSubstances
- `PatientService.swift` - getProfile, updateProfile

### Phase 4: Authentication Feature
**Files to create:**
- `LoginView.swift` - Email/password login form
- `RegisterView.swift` - Registration form with validation
- `AuthViewModel.swift` - Login/register logic, validation
- `CustomTextField.swift` - Styled text input
- `SecureTextField.swift` - Password field
- `PrimaryButton.swift` - Main action button

### Phase 5: Dashboard Feature
**Files to create:**
- `DashboardView.swift` - Main container with pull-to-refresh
- `TodayDosesCard.swift` - Today's scheduled/logged doses
- `AdherenceStatsCard.swift` - Weekly adherence ring
- `QuickActionsCard.swift` - Log dose shortcut
- `DashboardViewModel.swift` - Dashboard data fetching
- `DoseRowView.swift` - Individual dose display
- `CardView.swift` - Reusable card container

### Phase 6: Log Dose Feature
**Files to create:**
- `LogDoseView.swift` - Main form for logging
- `SubstancePickerView.swift` - Searchable substance list
- `InjectionSitePickerView.swift` - Body diagram picker
- `DoseConfirmationView.swift` - Success screen
- `LogDoseViewModel.swift` - Dose logging logic

### Phase 7: Dose History Feature
**Files to create:**
- `DoseHistoryView.swift` - Paginated list
- `DoseHistoryRow.swift` - Individual dose entry
- `DoseFilterSheet.swift` - Filter by date/substance
- `DoseHistoryViewModel.swift` - Pagination & filtering

### Phase 8: Protocols Feature
**Files to create:**
- `ProtocolsListView.swift` - Active protocols list
- `ProtocolDetailView.swift` - Protocol with substances
- `ProtocolScheduleView.swift` - Calendar/timeline view
- `ProtocolsListViewModel.swift` - Protocol fetching

### Phase 9: Navigation & Polish
**Files to create:**
- `AppRouter.swift` - Central navigation state
- `MainTabView.swift` - Tab bar (Dashboard, History, Protocols, Profile)
- `ProfileView.swift` - Patient profile
- `SettingsView.swift` - App settings, logout
- `LoadingView.swift` - Loading indicator
- `ErrorAlertModifier.swift` - Error handling

---

## Key Architecture Patterns

### MVVM Pattern
```swift
// ViewModel pattern
@MainActor
final class DashboardViewModel: ObservableObject {
    @Published private(set) var todayDoses: [Dose] = []
    @Published private(set) var isLoading = false
    @Published var error: AppError?

    private let doseService: DoseService

    func fetchData() async {
        isLoading = true
        defer { isLoading = false }
        do {
            todayDoses = try await doseService.getTodayDoses()
        } catch {
            self.error = AppError(from: error)
        }
    }
}
```

### Navigation (iOS 17 NavigationStack)
```swift
@MainActor
final class AppRouter: ObservableObject {
    @Published var selectedTab: Tab = .dashboard
    @Published var path = NavigationPath()
    @Published var presentedSheet: Sheet?

    enum Tab: String, CaseIterable {
        case dashboard, history, protocols, profile
    }
}
```

### Error Handling
- `APIError` enum for network errors
- `AppError` wrapper for user-facing errors
- `.errorAlert()` modifier for consistent display
- Auto-logout on 401 Unauthorized

---

## API Endpoints to Integrate

| Feature | Endpoint | Method |
|---------|----------|--------|
| Register | `/api/v1/auth/register/patient` | POST |
| Login | `/api/v1/auth/login` | POST |
| Refresh Token | `/api/v1/auth/refresh` | POST |
| Get Profile | `/api/v1/auth/me` | GET |
| Today's Doses | `/api/v1/doses/today` | GET |
| Log Dose | `/api/v1/doses` | POST |
| Dose History | `/api/v1/doses` | GET |
| Dose Stats | `/api/v1/doses/stats` | GET |
| Protocols | `/api/v1/patients/protocols` | GET |
| Protocol Detail | `/api/v1/protocols/:id` | GET |
| Substances | `/api/v1/substances` | GET |
| Categories | `/api/v1/substances/categories` | GET |

---

## Critical Backend Files for Reference

1. **`/api/src/routes/auth.routes.ts`** - Auth API contract
2. **`/api/src/routes/doses.routes.ts`** - Dose API contract
3. **`/api/src/types/index.ts`** - Zod schemas for request/response shapes
4. **`/packages/shared/prisma/schema.prisma`** - Database schema
5. **`/packages/shared/src/types/`** - Shared TypeScript types to align with

---

## Verification Plan

1. **Build & Run**: Create Xcode project, verify it compiles and launches
2. **Authentication Flow**:
   - Register new account -> verify token stored in Keychain
   - Login -> verify dashboard loads
   - Close/reopen app -> verify session restored
3. **Dashboard**:
   - Verify today's doses load from API
   - Verify adherence stats display
4. **Log Dose**:
   - Select substance, enter dose, submit
   - Verify dose appears in today's list
5. **Dose History**:
   - Verify pagination loads more items on scroll
   - Verify filters work (date range, substance)
6. **Protocols**:
   - Verify active protocols load
   - Verify protocol detail shows substances

---

## Starting Point

Begin with **Phase 1** by creating the Xcode project and setting up the foundation:
1. Create new Xcode project (SwiftUI App, iOS 17+)
2. Set up folder structure
3. Implement `APIClient` and `KeychainService`
4. Implement `AuthManager` for session state
5. Create basic `LoginView` to test auth flow
