from django import template

register = template.Library()

@register.filter(name='ifinlist')
def ifinlist(value, lst):
    return True if value in lst else False
