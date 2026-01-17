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