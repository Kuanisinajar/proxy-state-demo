// function observe(target, callback) {
// 	return new Proxy(target, {
// 		set: (targetObject, prop, value) => {
// 			console.log(targetObject, prop, value)
// 			callback(prop, value)
// 			targetObject[prop] = value
// 		}
// 	})
// }

// const obj = {
// 	name: 'Cool',
// 	age: 22,
// }

// const a = observe(obj, (key, value) => {
// 	console.log('observed change', key, value)
// })

// a.favItem = ['apple', 'orange']

// console.log('original object', obj)


const obj = {
	name: 'Kuan',
	age: 28,
}

const objProxy = new Proxy(obj, {
	get: (target, prop, value) => {
		console.log('in proxy:', target, prop, value)
	},
	set: (target, prop, value) => {
		console.log(prop, value)
	}
})

const b = objProxy.name;