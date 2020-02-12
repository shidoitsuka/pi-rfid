import sys, json

def read_in():
	lines = sys.stdin.readlines()
	return json.loads(lines[0])
	
lines = read_in()
print(lines)
