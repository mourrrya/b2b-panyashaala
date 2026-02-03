# Profile Page Refactoring - Structure Overview

## Changes Made

### 1. **Removed Account Overview Section**

- Eliminated the entire "Account Overview" card that displayed statistics
- This section contained dummy data (0 Orders, 0 Enquiries, 0 Reviews, Member Since year)

### 2. **Added Member Since to Header**

- Integrated "Member Since" information directly into the profile header
- Displays as a formatted date (e.g., "Member Since Jan 2024")
- Shows in a subtle badge below contact information in the header

### 3. **Modular Component Structure**

#### **Files Created:**

1. **`ProfileHeader.tsx`**
   - **Responsibility**: Display user profile header with avatar and basic info
   - **Props**:
     - `user`: User object with avatar, name, email, phone, account type, and createdAt
     - `onAvatarUpload`: Callback function for avatar image upload
   - **Features**:
     - Avatar display with camera icon overlay for upload
     - User name and contact information
     - "Member Since" badge with formatted date
     - Account type indicator (Business/Individual)
     - Responsive design

2. **`PersonalInfoCard.tsx`**
   - **Responsibility**: Display personal information in a card format
   - **Props**:
     - `fullName`: User's full name
     - `email`: User's email address
     - `phone`: User's phone number
     - `accountType`: Account type (BUSINESS/INDIVIDUAL)
   - **Features**:
     - Organized grid layout (2 columns on desktop, 1 on mobile)
     - Icon-based field labels
     - Read-only display format
     - Consistent styling with other cards

3. **`BusinessInfoCard.tsx`**
   - **Responsibility**: Display business-specific information
   - **Props**:
     - `companyName`: Company name
     - `gstIn`: GST identification number
     - `website`: Company website URL
   - **Features**:
     - Only rendered for BUSINESS account type
     - Clickable website links with proper URL handling
     - Consistent styling with personal info card
     - Organized grid layout

#### **Main Page File (`page.tsx`)**

- **Responsibility**: Orchestrate the profile page and manage state
- **Features**:
  - Manages user data fetching and loading state
  - Handles avatar upload logic
  - Conditionally renders business card based on user type
  - Passes data to child components as props

## Design Principles Applied

### **DRY (Don't Repeat Yourself)**

- Eliminated repetitive card header structure by creating reusable components
- Single source for icon definitions and styling patterns
- Abstracted common styling into components

### **SSOT (Single Source of Truth)**

- User data lives in the Zustand store (`useAuthStore`)
- No data duplication in components - all derived from parent props
- Loading state managed in one place (main page component)

### **SRP (Single Responsibility Principle)**

- **ProfileHeader**: Manages header display and avatar upload
- **PersonalInfoCard**: Displays personal information only
- **BusinessInfoCard**: Displays business information only
- **page.tsx**: Manages data flow and component composition

## Directory Structure

```
app/(private)/profile/
├── page.tsx (main component)
├── components/
│   ├── ProfileHeader.tsx
│   ├── PersonalInfoCard.tsx
│   └── BusinessInfoCard.tsx
```

## Type Safety

All components use TypeScript interfaces with proper null handling to match Prisma schema types:

- String fields can be `string | null` to match database schema
- All props are properly typed for IDE support and compile-time checking

## Future Enhancements

### Ready for:

- Add edit functionality to any card component
- Add address information component (separate card)
- Add preferences/settings card
- Add activity/history timeline
- Add support documents upload
- Add account security section

### To Add Edit Features:

1. Create an `useProfileForm` hook for form state management
2. Create `EditPersonalInfoCard.tsx` component
3. Create `EditBusinessInfoCard.tsx` component
4. Add conditional rendering in page.tsx to show edit vs. view mode
5. Keep the view components read-only (as they are now)

## Styling Consistency

All cards follow the same pattern:

- White background with shadow and rounded corners
- Color-coded header with gradient background
- Icon with matching color scheme
- Title and description in header
- Consistent padding and spacing
- Responsive grid layouts

The color schemes are:

- **Personal Info**: Emerald/Teal (green)
- **Business Info**: Blue/Indigo
- **Background**: Light emerald/teal gradient
