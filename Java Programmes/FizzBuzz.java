import java.util.Scanner;

public class FizzBuzz {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {

            System.out.print("Number: ");
            double num = scanner.nextDouble();
            
            if (num%5==0 && num%3==0) {
                System.out.println("FizzBuzz");
            }

            else if (num%5 == 0) {
                System.out.println("Fizz");
            }

            else if (num%3==0){
                System.out.println("Buzz");
            }

            else {
                System.out.println(num);
            }

        }
    }
}
