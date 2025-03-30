from django.db import models
from django.utils import timezone


class User(models.Model):
    """
    Stores system user information
    """
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=128)  

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Artist(models.Model):
    """
    Stores artist information
    """
    id = models.AutoField(primary_key=True)
    artist_name = models.CharField(max_length=100)

    def __str__(self):
        return self.artist_name

    class Meta:
        db_table = 'artist'
        verbose_name = 'Artist'
        verbose_name_plural = 'Artists'


class MasterRelease(models.Model):
    """
    Stores master release information (e.g., album title, linked artist)
    """
    id = models.IntegerField(primary_key=True)  # Discogs master_id
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} (Master ID: {self.id})"

    class Meta:
        db_table = 'master_release'
        verbose_name = 'Master Release'
        verbose_name_plural = 'Master Releases'


class Release(models.Model):
    """
    Stores release version details (e.g., year, format)
    """
    id = models.IntegerField(primary_key=True)  
    # Discogs release_id
    discogs_id = models.IntegerField(null=True, blank=True)
    title = models.CharField(max_length=255)
    release_year = models.PositiveSmallIntegerField(null=True, blank=True)
    format = models.CharField(max_length=50, default='Vinyl', blank=True)
    master = models.ForeignKey(
        MasterRelease,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    artist = models.ForeignKey(
        Artist,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    cover_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.title} (Release ID: {self.id})"

    class Meta:
        db_table = 'release'
        verbose_name = 'Release'
        verbose_name_plural = 'Releases'


class Genre(models.Model):
    """
    Stores music genre names
    """
    id = models.AutoField(primary_key=True)
    genre_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.genre_name

    class Meta:
        db_table = 'genre'
        verbose_name = 'Genre'
        verbose_name_plural = 'Genres'


class ReleaseGenre(models.Model):
    """
    Many-to-many relationship between Release and Genre
    """
    id = models.AutoField(primary_key=True)
    release = models.ForeignKey(Release, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    class Meta:
        db_table = 'release_genre'
        unique_together = ('release', 'genre')
        verbose_name = 'Release-Genre Mapping'
        verbose_name_plural = 'Release-Genre Mappings'

    def __str__(self):
        return f"{self.release} - {self.genre}"


class Collection(models.Model):
    """
    Stores user-collected records with quantity, price, date, and description
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    release = models.ForeignKey(Release, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateTimeField(auto_now_add=True,blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"User {self.user_id} - Release {self.release_id}"

    class Meta:
        db_table = 'collection'
        verbose_name = 'Collection Record'
        verbose_name_plural = 'Collection Records'


class Wantlist(models.Model):
    """
    Stores records users want to purchase
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    release = models.ForeignKey(Release, on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"User {self.user_id} - Want {self.release_id}"

    class Meta:
        db_table = 'wantlist'
        verbose_name = 'Wantlist Entry'
        verbose_name_plural = 'Wantlist Entries'
