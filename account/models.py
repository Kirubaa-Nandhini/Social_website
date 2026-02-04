from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from images.models import Contact
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
           on_delete=models.CASCADE)
    date_of_birth = models.DateField(blank=True, null=True)
    photo = models.ImageField(upload_to='users/%Y/%m/%d/',
    blank=True)
    def __str__(self):
      return f'Profile for user {self.user.username}'
    user_model = get_user_model()
    user_model.add_to_class(
       'following',
       models.ManyToManyField(
              'self',
              through=Contact,
              related_name='followers',
              symmetrical=False
       )
       )