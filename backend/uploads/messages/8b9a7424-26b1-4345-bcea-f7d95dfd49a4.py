


small_conv =  0.001
middle_conv = 0.03
high_conv = 0.08


q_aud = int(input("Охват: "))
price = int(input("Цена курса: "))



print(q_aud*price*small_conv)
print(q_aud*price*middle_conv)
print(q_aud*price*high_conv)
