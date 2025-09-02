# DataLab Georgia - API კონტრაქტები და ინტეგრაციის გზამკვლევი

## 1. პროექტის მიმოხილვა

DataLab Georgia-ს საიტი შექმნილია React-ში მუქი თემით და წითელი აქცენტებით. საიტი შეიცავს:
- ორენოვანი მხარდაჭერა (ქართული/ინგლისური)
- 4 ძირითადი სერვისი (მონაცემთა აღდგენა, სარეზერვო კოპირება, აპარატური შეკეთება, სასამართლო აღდგენა)
- სერვისის მოთხოვნის ფორმა
- ფასის კალკულატორი
- საქმის თვალთვალი
- ტესტიმონიალები
- კონტაქტი

## 2. Mock მონაცემები (frontend/src/data/mockData.js)

### 2.1 მომსახურებები (services)
```javascript
- HDD/SSD/RAID/USB/SD მონაცემთა აღდგენა
- სარეზერვო კოპირება
- აპარატური შეკეთება
- სასამართლო მონაცემთა აღდგენა
```

### 2.2 ტესტიმონიალები (testimonials)
```javascript
- 3 კლიენტის გამოხმაურება (ქართული/ინგლისური)
- 5 ვარსკვლავიანი რეიტინგი
- ავატარებით და პოზიციებით
```

### 2.3 Mock საქმეების თვალთვალი (mockCases)
```javascript
- DL2024001 (completed, 100%)
- DL2024002 (in_progress, 75%)
```

## 3. Backend API რუქა

### 3.1 MongoDB მოდელები

#### ServiceRequest Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (required),
  deviceType: String (enum: ['hdd', 'ssd', 'raid', 'usb', 'sd', 'other']),
  problemDescription: String (required),
  urgency: String (enum: ['low', 'medium', 'high', 'critical']),
  status: String (enum: ['pending', 'in_progress', 'completed'], default: 'pending'),
  caseId: String (auto-generate: DL + year + sequential number),
  createdAt: Date (default: now),
  estimatedCompletion: Date,
  price: Number
}
```

#### ContactMessage Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  createdAt: Date (default: now),
  status: String (enum: ['new', 'read', 'replied'], default: 'new')
}
```

#### Testimonial Model (optional - for admin management)
```javascript
{
  _id: ObjectId,
  name: String,
  nameEn: String,
  position: String,
  positionEn: String,
  textKa: String,
  textEn: String,
  rating: Number (1-5, default: 5),
  image: String (URL),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

### 3.2 API Endpoints

#### Service Requests
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests/:caseId` - Get case by ID for tracking
- `GET /api/service-requests` - Get all requests (admin)
- `PUT /api/service-requests/:id` - Update request status (admin)

#### Contact Messages
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all messages (admin)
- `PUT /api/contact/:id/status` - Mark as read/replied (admin)

#### Price Estimation
- `POST /api/price-estimate` - Calculate price estimate
  - Input: deviceType, problemType, urgency
  - Output: estimated price and timeframe

#### Testimonials
- `GET /api/testimonials` - Get active testimonials
- `POST /api/testimonials` - Add testimonial (admin)
- `PUT /api/testimonials/:id` - Update testimonial (admin)

## 4. Frontend ინტეგრაცია

### 4.1 მონაცემების წაშლა mockData.js-დან
1. `testimonials` array წავშალოთ mockData.js-დან
2. `mockCases` array წავშალოთ
3. API calls დავამატოთ შესაბამის კომპონენტებში

### 4.2 კომპონენტების ცვლილებები

#### ServiceRequest.js
```javascript
// Replace mock form submission with API call
const response = await axios.post(`${API}/service-requests`, formData);
// Display generated case ID in toast
```

#### CaseTracking.js
```javascript
// Replace mockCases lookup with API call
const response = await axios.get(`${API}/service-requests/${trackingId}`);
```

#### PriceEstimation.js
```javascript
// Add API call for price calculation
const response = await axios.post(`${API}/price-estimate`, {
  deviceType, problemType, urgency
});
```

#### Contact.js
```javascript
// Replace mock submission with API call
const response = await axios.post(`${API}/contact`, formData);
```

#### Testimonials.js
```javascript
// Replace mock testimonials with API call
useEffect(() => {
  const fetchTestimonials = async () => {
    const response = await axios.get(`${API}/testimonials`);
    setTestimonials(response.data);
  };
  fetchTestimonials();
}, []);
```

## 5. ფასის კალკულაცია

### 5.1 ფასის ფორმულა
```javascript
finalPrice = basePrice * problemMultiplier * urgencyMultiplier

Base Prices:
- HDD: 100₾
- SSD: 150₾
- RAID: 300₾
- USB: 80₾
- SD Card: 60₾

Problem Multipliers:
- Logical: 1.0
- Physical: 1.5
- Water damage: 2.0
- Fire damage: 2.5

Urgency Multipliers:
- Standard (5-7 days): 1.0
- Urgent (2-3 days): 1.5
- Emergency (24 hours): 2.0
```

## 6. Case ID გენერაცია

ფორმატი: `DL + YYYY + 3-digit sequence`
მაგ: `DL2024001`, `DL2024002`

MongoDB sequence counter გამოიყენება sequential numbering-სთვის.

## 7. Error Handling

### 7.1 Frontend
- Form validation before submission
- API error handling with user-friendly messages
- Loading states for all API calls

### 7.2 Backend
- Input validation with proper error messages
- Try-catch blocks for all database operations
- Proper HTTP status codes

## 8. პრიორიტეტები

1. **Service Request API** - ყველაზე მნიშვნელოვანი
2. **Case Tracking API** - მომხმარებლების მოთხოვნით
3. **Contact Message API** - ყოველდღიური გამოყენებისთვის
4. **Price Estimation API** - ბიზნეს ლოგიკა
5. **Testimonials API** - ადმინისტრაციისთვის

## 9. მომდევნო ნაბიჯები

1. Backend მოდელებისა და endpoints-ების შექმნა
2. Frontend-ში mock მონაცემების API calls-ით ჩანაცვლება
3. Error handling და loading states-ის დამატება
4. ტესტირება ყველა functionality-ის
5. უსაფრთხოება და ოპტიმიზაცია