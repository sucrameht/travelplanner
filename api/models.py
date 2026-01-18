from django.db import models

class Trip(models.Model):
    name = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Storing travelers as a JSON list (e.g. ["Alice", "Bob"])
    travelers = models.JSONField(default=list) 

    def __str__(self):
        return self.name

class Stop(models.Model):
    trip = models.ForeignKey(Trip, related_name='stops', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    order = models.IntegerField(default=0) # For Drag & Drop sorting

    # --- Specific Details ---
    CATEGORY_CHOICES = [
        ('FOOD', 'Food'),
        ('ATTRACTION', 'Attraction'),
        ('ACCOMMODATION', 'Accommodation'),
        ('OTHER', 'Other'),
    ]
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='ATTRACTION')
    
    reservation_required = models.BooleanField(default=False)
    
    # "Day 1", "Day 2", etc.
    day = models.IntegerField(default=1) 
    
    # Optional time (e.g., 14:30)
    visit_time = models.TimeField(null=True, blank=True)
    
    # User remarks (up to 1000 chars)
    remarks = models.TextField(max_length=1000, blank=True, default="")

    class Meta:
        ordering = ['day', 'order'] # Sort by Day first, then by Order

class Itinerary(models.Model):
    trip = models.ForeignKey(Trip, related_name='itinerary', on_delete=models.CASCADE)
    date = models.DateField()
    location = models.CharField(max_length=200)
    activity = models.CharField(max_length=200, blank=True, default='')
    time = models.TimeField(null=True, blank=True)
    duration = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Duration in hours')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True, default='')
    photo_url = models.URLField(max_length=500, blank=True, default='', help_text='Photo URL for the location')
    links = models.JSONField(default=list, blank=True, help_text='List of booking/info links')

    class Meta:
        ordering = ['date', 'time']
        verbose_name_plural = 'Itineraries'

    def __str__(self):
        return f"{self.trip.name} - {self.date} - {self.location}"

class Expense(models.Model):
    trip = models.ForeignKey(Trip, related_name='expenses', on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')  # Currency code (USD, EUR, SGD, etc.)
    category = models.CharField(max_length=50, default='Other')
    date = models.DateField()
    paid_by = models.CharField(max_length=100, blank=True, default='')  # Who paid for this expense
    split_between = models.JSONField(default=list)  # List of travelers splitting this expense
    
    # Split type: 'equal', 'percentage', or 'fixed'
    split_type = models.CharField(max_length=20, default='equal')
    
    # Custom split details: {person: amount/percentage} for non-equal splits
    split_details = models.JSONField(default=dict, blank=True)
    
    # Recurring expense fields
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=20, blank=True, default='')  # 'daily', 'weekly', 'monthly'

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.trip.name} - {self.description} - {self.currency}{self.amount}"

class Flight(models.Model):
    trip = models.ForeignKey(Trip, related_name='flights', on_delete=models.CASCADE)
    flight_number = models.CharField(max_length=20)
    flight_date = models.DateField()
    flight_data = models.JSONField(default=dict, blank=True)  # Store API response data
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['flight_date']
    
    def __str__(self):
        return f"{self.trip.name} - {self.flight_number} on {self.flight_date}"

class SuggestedEvent(models.Model):
    """Cache for AI-generated event suggestions by destination"""
    destination = models.CharField(max_length=200, unique=True, db_index=True)
    events_data = models.JSONField()  # Store the full events array
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Suggestions for {self.destination}"

class TravelMethod(models.Model):
    """Travel methods between consecutive stops in itinerary"""
    MODE_CHOICES = [
        ('WALK', 'Walk'),
        ('BUS', 'Bus'),
        ('TRAIN', 'Train'),
        ('CYCLE', 'Cycle'),
        ('DRIVE', 'Drive'),
        ('PRIVATE_HIRE', 'Private Hire'),
    ]
    
    trip = models.ForeignKey(Trip, related_name='travel_methods', on_delete=models.CASCADE)
    from_stop = models.ForeignKey(Itinerary, related_name='travel_from', on_delete=models.CASCADE)
    to_stop = models.ForeignKey(Itinerary, related_name='travel_to', on_delete=models.CASCADE)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES)
    distance = models.DecimalField(max_digits=10, decimal_places=2, help_text='Distance in km')
    duration = models.DecimalField(max_digits=10, decimal_places=2, help_text='Duration in minutes')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Estimated cost')
    
    # Transit-specific fields (for bus/train)
    line_number = models.CharField(max_length=50, blank=True, default='')
    boarding_stop = models.CharField(max_length=200, blank=True, default='')
    alighting_stop = models.CharField(max_length=200, blank=True, default='')
    number_of_stops = models.IntegerField(default=0, help_text='Number of stops for bus/train')
    
    # Order for multiple travel methods between same stops (for transfers)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['from_stop', 'order']
    
    def __str__(self):
        return f"{self.trip.name} - {self.mode} from {self.from_stop.location} to {self.to_stop.location}"

class MyActivity(models.Model):
    """User-created activities that can be added to trips"""
    trip = models.ForeignKey(Trip, related_name='my_activities', on_delete=models.CASCADE)
    place = models.CharField(max_length=200)
    activity = models.TextField()
    recommended_time = models.DecimalField(max_digits=5, decimal_places=2, help_text='Recommended time in hours')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    photo_url = models.URLField(max_length=500, blank=True, default='', help_text='URL of the place photo')
    links = models.JSONField(default=list, help_text='List of booking/info links')  # [{"label": "Booking Site", "url": "https://..."}]
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'My Activities'
    
    def __str__(self):
        return f"{self.place} - {self.activity[:50]}"
