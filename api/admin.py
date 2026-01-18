from django.contrib import admin
from .models import Trip, Stop, Itinerary, Expense, SuggestedEvent, MyActivity

# Register your models here.
admin.site.register(Trip)
admin.site.register(Stop)
admin.site.register(Itinerary)
admin.site.register(Expense)
admin.site.register(SuggestedEvent)
admin.site.register(MyActivity)
